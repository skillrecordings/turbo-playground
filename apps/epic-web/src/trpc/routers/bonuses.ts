import {Redis} from '@upstash/redis'
import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getToken} from 'next-auth/jwt'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const bonusesRouter = router({
  availableBonusesForPurchase: publicProcedure
    .input(
      z.object({
        purchaseId: z.string().optional(),
      }),
    )
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token || !input.purchaseId) return []

      const availableBonuses: string | null = await redis.get(
        `bonus::available::${token.id}::${input.purchaseId}`,
      )

      const bonusSlugs = availableBonuses?.split(',') || []

      const query = `*[_type == "bonus" && slug.current in ${JSON.stringify(
        bonusSlugs,
      )}]{
              title,
              "slug": slug.current,
              description
            }`

      return await sanityClient.fetch(query)
    }),
  redeemBonus: publicProcedure
    .input(
      z.object({
        purchaseId: z.string().optional(),
        bonusSlug: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token || !input.purchaseId) return false

      const availableBonuses: string | null = await redis.get(
        `bonus::available::${token.id}::${input.purchaseId}`,
      )

      const bonusSlugs = availableBonuses?.split(',') || []

      if (bonusSlugs.includes(input.bonusSlug)) {
        let sellableId

        if (input.bonusSlug === 'testing-javascript') {
          sellableId = 273899
        } else if (input.bonusSlug === 'epic-react') {
          sellableId = 385975
        }

        if (!sellableId) throw new Error('No sellableId found for bonus slug')

        await fetch(
          `https://app.egghead.io/api/v1/sellable_purchases/redeem_partner_coupon`,
          {
            method: 'POST',
            body: JSON.stringify({
              sellable: 'playlist',
              sellable_id: sellableId,
              email: token.email,
            }),
            headers: {
              Authorization: `Bearer ${process.env.EGGHEAD_EPIC_WEB_BOT_TOKEN}`,
            },
          },
        )

        const newBonuses = bonusSlugs.filter((slug) => slug !== input.bonusSlug)

        if (newBonuses.length === 0) {
          await redis.del(`bonus::available::${token.id}::${input.purchaseId}`)
        } else {
          await redis.set(
            `bonus::available::${token.id}::${input.purchaseId}`,
            newBonuses.join(','),
          )
        }
      }
      return true
    }),
})
