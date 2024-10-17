import {postToSlack} from '@skillrecordings/skill-api'
import {WebClient} from '@slack/web-api'
import {inngest} from 'inngest/inngest.server'
import {
  fetchCharges,
  fetchRefunds,
  SimplifiedCharge,
  SimplifiedRefund,
} from 'lib/transactions'
import {prisma} from '@skillrecordings/database'
import {calculateTotals} from 'components/calculations/calculate-totals'
import {calculateSplits} from 'components/calculations/calculate-splits'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100)
}

type SplitData = {
  percent: number
  userId: string | null
  type: string
}

type ProductSplits = Record<string, SplitData>

type Splits = Record<string, ProductSplits>

type UserData = Record<string, string>

export const slackDailyReporter = inngest.createFunction(
  {
    id: 'stripe/slack-daily-reporter',
    name: 'Stripe Slack Daily Reporter',
  },
  {
    cron: 'TZ=America/Los_Angeles 0 10 * * *',
  },
  async ({step}) => {
    const allCharges: SimplifiedCharge[] = []
    const allRefunds: SimplifiedRefund[] = []
    let hasMore = true
    let startingAfter: string | undefined = undefined

    while (hasMore) {
      const fetchChargePage: Awaited<ReturnType<typeof fetchCharges>> =
        await step.run(
          `fetch-charges${startingAfter ? `-${startingAfter}` : ''}`,
          async () => {
            return fetchCharges({
              range: 'yesterday',
              starting_after: startingAfter,
            })
          },
        )

      allCharges.push(...fetchChargePage.charges)
      hasMore = fetchChargePage.has_more
      startingAfter = fetchChargePage.next_page_cursor || undefined
    }

    // Fetch refunds
    hasMore = true
    startingAfter = undefined
    while (hasMore) {
      const fetchRefundPage: Awaited<ReturnType<typeof fetchRefunds>> =
        await step.run(
          `fetch-refunds${startingAfter ? `-${startingAfter}` : ''}`,
          async () => {
            return fetchRefunds({
              range: 'yesterday',
              starting_after: startingAfter,
            })
          },
        )
      allRefunds.push(...fetchRefundPage.refunds)
      hasMore = fetchRefundPage.has_more
      startingAfter = fetchRefundPage.next_page_cursor || undefined
    }

    const {totals, refundTotals} = await step.run(
      'calculate-totals',
      async () => calculateTotals(allCharges, allRefunds),
    )

    const splits: Splits = await step.run('load splits', async () => {
      const dbSplits = await prisma.productRevenueSplit.findMany({
        where: {
          productId: {
            in: Object.values(totals.productGroups).map(
              (group) => group.productId,
            ),
          },
        },
      })

      return dbSplits.reduce<Splits>((acc: any, split: any) => {
        if (!acc[split.productId]) {
          acc[split.productId] = {}
        }
        acc[split.productId][split.id] = {
          percent: split.percent,
          userId: split.userId,
          type: split.type,
        }
        return acc
      }, {})
    })

    const users: UserData = await step.run('fetch users', async () => {
      const userIds = new Set<string>()
      Object.values(splits).forEach((productSplits) => {
        Object.values(productSplits).forEach((split) => {
          if (split.userId) userIds.add(split.userId)
        })
      })

      const dbUsers = await prisma.user.findMany({
        where: {
          id: {
            in: Array.from(userIds),
          },
        },
        select: {
          id: true,
          name: true,
        },
      })

      return dbUsers.reduce((acc, user) => {
        acc[user.id] = user.name || 'Unnamed User'
        return acc
      }, {} as UserData)
    })

    const calculatedSplits = await step.run('calculate splits', async () =>
      calculateSplits(totals, splits, users),
    )

    interface UserData {
      [userId: string]: string
    }

    interface SlackChannelIds {
      [userId: string]: string | null
    }

    interface Contributor {
      userId: string
      saleAnnounceChannel: string
    }

    const OWNER_USER_ID = '4ef27e5f-00b4-4aa3-b3c4-4a58ae76f50b'

    type ProductGroup = {
      productId: string
      productName: string
      count: number
      amount: number
    }

    const slackChannelIds = await step.run(
      'load slack channel ids for all users',
      async (): Promise<SlackChannelIds> => {
        const userIds = Object.keys(users)

        const query = groq`*[_type == "contributor" && userId in $userIds] {
      userId,
      saleAnnounceChannel
    }`

        const contributors: Contributor[] = await sanityClient.fetch(query, {
          userIds,
        })

        const slackChannelMap = contributors.reduce<SlackChannelIds>(
          (acc, contributor) => {
            if (contributor.userId && contributor.saleAnnounceChannel) {
              acc[contributor.userId] = contributor.saleAnnounceChannel
            }
            return acc
          },
          {},
        )

        const slackIds: SlackChannelIds = userIds.reduce<SlackChannelIds>(
          (acc, userId) => {
            if (userId === OWNER_USER_ID) {
              acc[userId] = process.env.SLACK_ANNOUNCE_CHANNEL_ID || null
            } else {
              acc[userId] = slackChannelMap[userId] || null
            }
            return acc
          },
          {},
        )

        return slackIds
      },
    )

    const generateChartUrl = (
      userProducts: Record<string, Record<string, ProductGroup>>,
      userSplits: Record<
        string,
        {
          creatorSplits: Record<string, number>
          products: Record<string, {creatorSplits: Record<string, number>}>
        }
      >,
      userName: string,
    ): string => {
      const productData: {[productName: string]: number} = {}

      for (const [groupName, groupProducts] of Object.entries(userProducts)) {
        for (const [productKey, product] of Object.entries(groupProducts)) {
          const creatorShare =
            userSplits[groupName]?.products[productKey]?.creatorSplits[
              userName
            ] || 0
          productData[product.productName] =
            (productData[product.productName] || 0) + creatorShare
        }
      }

      const labels = Object.keys(productData)
      const data = Object.values(productData)
      const formattedLabels = labels.map(
        (name, index) => `${name}: ${formatCurrency(data[index])}`,
      )

      const total = data.reduce((sum, value) => sum + value, 0)
      const formattedTotal = formatCurrency(total)

      const chartData = {
        type: 'doughnut',
        data: {
          labels: formattedLabels,
          datasets: [
            {
              data: data,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
              ],
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: 'Revenue Distribution by Product',
            fontColor: 'black',
          },
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 15,
              padding: 15,
              fontColor: 'black',
            },
          },
          plugins: {
            datalabels: {
              display: false,
            },
            doughnutlabel: {
              labels: [
                {
                  text: formattedTotal,
                  font: {size: 16, weight: 'bold'},
                  color: 'black',
                },
                {
                  text: 'total',
                  font: {size: 12},
                  color: 'black',
                },
              ],
            },
          },
        },
      }

      const encodedChartData = encodeURIComponent(JSON.stringify(chartData))
      return `https://quickchart.io/chart?c=${encodedChartData}&backgroundColor=white`
    }

    await step.run('announce in slack', async () => {
      const {productGroups} = totals
      const {groupSplits} = calculatedSplits

      const webClient = new WebClient(process.env.SLACK_TOKEN)
      const sentMessages: Record<string, boolean> = {}
      const results: Array<{
        userId: string
        channelId: string
        success: boolean
        error?: string
      }> = []

      for (const [userId, channelId] of Object.entries(slackChannelIds)) {
        if (channelId && !sentMessages[channelId]) {
          // Filter data for the specific user
          const userSplits: Record<
            string,
            {
              creatorSplits: Record<string, number>
              products: Record<
                string,
                {
                  creatorSplits: Record<string, number>
                }
              >
            }
          > = {}
          const userProducts: Record<string, Record<string, ProductGroup>> = {}

          for (const [groupName, groupSplit] of Object.entries(groupSplits)) {
            const userName = users[userId]
            if (userName && groupSplit.creatorSplits[userName]) {
              userSplits[groupName] = {
                creatorSplits: {[userName]: groupSplit.creatorSplits[userName]},
                products: {},
              }

              userProducts[groupName] = {}
              for (const [productKey, productSplit] of Object.entries(
                groupSplit.products,
              )) {
                if (productSplit.creatorSplits[userName]) {
                  userProducts[groupName][productKey] =
                    productGroups[productKey]
                  userSplits[groupName].products[productKey] = {
                    creatorSplits: {
                      [userName]: productSplit.creatorSplits[userName],
                    },
                  }
                }
              }
            }
          }

          // Calculate user-specific total splits and transaction count
          const userName = users[userId]
          let userTotalRevenue = 0
          let userTotalTransactions = 0
          const userTotalSplits: Record<string, number> = {}

          for (const groupSplit of Object.values(userSplits)) {
            if (userName) {
              userTotalRevenue += groupSplit.creatorSplits[userName] || 0
              userTotalSplits[userName] =
                (userTotalSplits[userName] || 0) +
                (groupSplit.creatorSplits[userName] || 0)
            }
          }

          // count all transactions
          for (const groupProducts of Object.values(userProducts)) {
            for (const product of Object.values(groupProducts)) {
              userTotalTransactions += product.count
            }
          }

          const chartUrl = generateChartUrl(userProducts, userSplits, userName)

          const blocks: any[] = [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: 'Your Daily Revenue Report 💰',
                emoji: true,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Daily Report for ${userName} - ${new Date(
                  Date.now() - 86400000,
                ).toLocaleDateString()}*`,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `${userTotalTransactions} Transactions | ${formatCurrency(
                  userTotalRevenue,
                )}`,
              },
            },
            {
              type: 'image',
              title: {
                type: 'plain_text',
                text: 'Your Revenue Distribution',
              },
              image_url: chartUrl,
              alt_text: 'Revenue Distribution Chart',
            },
            {
              type: 'divider',
            },
          ]

          for (const [groupName, groupData] of Object.entries(userSplits)) {
            blocks.push({
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${groupName}*`,
              },
            })

            const groupProducts = Object.entries(userProducts[groupName])
            if (groupProducts.length === 1) {
              const [key, stats] = groupProducts[0]
              const productSplit = groupData.products[key]

              if (
                userName &&
                productSplit.creatorSplits[userName] !== undefined
              ) {
                blocks.push({
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `• *${stats.productName}*\n${
                      stats.count
                    } transactions | ${formatCurrency(
                      productSplit.creatorSplits[userName],
                    )}`,
                  },
                })
              }
            } else {
              const totalGroupTransactions = groupProducts.reduce(
                (sum, [_, stats]) => sum + stats.count,
                0,
              )

              if (userName && groupData.creatorSplits[userName] !== undefined) {
                blocks.push({
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `${totalGroupTransactions} Transactions | ${formatCurrency(
                      groupData.creatorSplits[userName],
                    )}`,
                  },
                })

                blocks.push({
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: '*Individual Products:*',
                  },
                })

                for (const [key, stats] of groupProducts) {
                  const productSplit = groupData.products[key]
                  if (productSplit.creatorSplits[userName] !== undefined) {
                    blocks.push({
                      type: 'section',
                      text: {
                        type: 'mrkdwn',
                        text: `• *${stats.productName}*\n${
                          stats.count
                        } transactions | ${formatCurrency(
                          productSplit.creatorSplits[userName],
                        )}`,
                      },
                    })
                  }
                }
              }
            }

            blocks.push({
              type: 'divider',
            })
          }

          try {
            await postToSlack({
              channel: channelId,
              webClient,
              text: 'Your Daily Revenue Report',
              blocks,
            })
            sentMessages[channelId] = true
            results.push({userId, channelId, success: true})
          } catch (error) {
            console.error(
              `Failed to send message to channel ${channelId} for user ${userId}:`,
              error,
            )
            results.push({
              userId,
              channelId,
              success: false,
              error: error instanceof Error ? error.message : String(error),
            })
          }
        }
      }

      return {
        totalSent: results.filter((r) => r.success).length,
        totalFailed: results.filter((r) => !r.success).length,
        details: results,
      }
    })
  },
)
