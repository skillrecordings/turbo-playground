import React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/image'
import {trpc} from '../trpc/trpc.client'
import {Icon, IconNames} from '@skillrecordings/skill-lesson/icons'
import {format} from 'date-fns'
import Link from 'next/link'
import InviteTeam from '@skillrecordings/skill-lesson/team'
import {useSession} from 'next-auth/react'
import {ProductPageProps, Purchase} from 'pages/products/[slug]'
import Spinner from '@skillrecordings/skill-lesson/spinner'
import BuyMoreSeats from '@skillrecordings/skill-lesson/team/buy-more-seats'
import {ClaimedTeamSeats} from '@skillrecordings/skill-lesson/team/claimed-team-seats'
import pluralize from 'pluralize'
import {Transfer} from 'purchase-transfer/purchase-transfer'
import cx from 'classnames'
import Balancer from 'react-wrap-balancer'
import {
  FormattedPrice,
  SanityProduct,
  SanityProductModule,
} from '@skillrecordings/commerce-server/dist/@types'
import {
  ModuleProgressProvider,
  useModuleProgress,
} from '@skillrecordings/skill-lesson/video/module-progress'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {usePriceCheck} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {PriceDisplay} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {QueryStatus} from '@tanstack/react-query'
import {buildStripeCheckoutPath} from '@skillrecordings/skill-lesson/utils/build-stripe-checkout-path'
import {Button} from '@skillrecordings/ui'
import {cn} from '@skillrecordings/ui/utils/cn'

const PurchasedProductTemplate: React.FC<ProductPageProps> = ({
  purchases = [],
  product,
  existingPurchase,
  userId,
}) => {
  const purchasesForCurrentProduct = purchases.filter((purchase) => {
    return purchase.productId === product.productId
  })
  const purchase = purchasesForCurrentProduct[0]

  const {data: session} = useSession()

  const [personalPurchase, setPersonalPurchase] = React.useState<any>(
    purchase.bulkCoupon ? existingPurchase : purchase,
  )
  const {data: purchaseUserTransfers, refetch} =
    trpc.purchaseUserTransfer.forPurchaseId.useQuery({
      id: purchase.id,
    })

  const isTransferAvailable =
    !purchase.bulkCoupon &&
    Boolean(
      purchaseUserTransfers?.filter((purchaseUserTransfer) =>
        ['AVAILABLE', 'INITIATED', 'COMPLETED'].includes(
          purchaseUserTransfer.transferState,
        ),
      ).length,
    )
  const {merchantCoupon} = usePriceCheck()
  const {data: formattedPrice, status} = trpc.pricing.formatted.useQuery({
    productId: product.productId,
    quantity: 1,
    merchantCoupon: merchantCoupon || undefined,
  })
  const {data: purchaseToUpgrade} = trpc.purchases.getPurchaseById.useQuery({
    purchaseId: formattedPrice?.upgradeFromPurchaseId,
  })
  const isRestrictedUpgrade = purchaseToUpgrade?.status === 'Restricted'

  return (
    <Layout meta={{title: product.name}}>
      <main
        data-product-page=""
        className="mx-auto flex w-full max-w-screen-lg flex-col gap-10 lg:flex-row"
      >
        <article className="w-full max-w-4xl px-5 pb-32 pt-16">
          <Link
            href="/products"
            className="group mb-10 inline-flex gap-1 text-sm opacity-75 transition hover:opacity-100"
          >
            <span className="transition group-hover:-translate-x-1">←</span>{' '}
            <span>All Products</span>
          </Link>
          <header className="">
            <PurchasedBadge />
            <h1 className="font-text pt-5 text-3xl font-semibold sm:text-4xl">
              <Balancer>{product.name}</Balancer>
            </h1>
          </header>
          <div className="">
            {purchase.bulkCoupon && (
              <>
                <H2>Invite your team</H2>
                <InviteTeam
                  className="[&_[data-redeem]>[data-sr-button]]:bg-primary [&_[data-redeem]>[data-sr-button]]:text-base [&_[data-redeem]>[data-sr-button]]:!text-primary-foreground [&_[data-redeem]]:flex [&_[data-redeem]]:w-full [&_[data-redeem]]:!justify-end [&_[data-sr-button]]:border-none  [&_[data-sr-button]]:bg-secondary [&_[data-sr-button]]:text-sm [&_[data-sr-button]]:font-medium [&_[data-sr-button]]:!text-foreground dark:[&_[data-sr-button]]:!text-white [&_input]:!border-border [&_input]:!bg-input [&_input]:selection:!text-white dark:[&_input]:!bg-input"
                  session={session}
                  purchase={purchasesForCurrentProduct[0]}
                  existingPurchase={existingPurchase}
                  setPersonalPurchase={setPersonalPurchase}
                />

                <H2>Team members</H2>
                <ClaimedTeamSeats
                  session={session}
                  purchase={purchase}
                  existingPurchase={existingPurchase}
                  setPersonalPurchase={setPersonalPurchase}
                />
              </>
            )}
            {isRestrictedUpgrade ? (
              <>
                <H2 className="pt-10">Regional License</H2>
                <Upgrade
                  purchaseToUpgrade={purchaseToUpgrade}
                  formattedPrice={formattedPrice}
                  formattedPriceStatus={status}
                  product={product}
                  purchase={purchase}
                  userId={purchase.userId}
                />
              </>
            ) : (
              <>
                <H2>Buy more seats</H2>
                <BuyMoreSeats
                  className="flex [&_[data-full-price]]:line-through [&_[data-percent-off]]:text-primary dark:[&_[data-percent-off]]:text-blue-300 [&_[data-price-container]]:!flex [&_[data-price-container]]:!w-full [&_[data-price-discounted]]:flex [&_[data-price-discounted]]:items-center [&_[data-price-discounted]]:gap-2 [&_[data-price-discounted]]:pl-3 [&_[data-price-discounted]]:text-base [&_[data-price-discounted]]:font-medium [&_[data-price]]:flex [&_[data-price]]:text-2xl [&_[data-price]]:font-bold [&_[data-pricing-product-header]]:w-full [&_[data-pricing-product]]:w-full [&_button]:!bg-primary [&_button]:!px-4 [&_button]:!py-1.5 [&_button]:!font-medium [&_button]:!text-primary-foreground [&_input]:text-sm [&_sup]:top-2.5 [&_sup]:pr-1 [&_sup]:opacity-75"
                  productId={purchase.productId}
                  userId={userId}
                />
              </>
            )}
            {isTransferAvailable && purchaseUserTransfers && (
              <>
                <H2>Purchase Transfer</H2>
                <Transfer
                  className="[&_h2]:hidden"
                  purchaseUserTransfers={purchaseUserTransfers}
                  refetch={refetch}
                />
              </>
            )}
            <H2>Invoices</H2>
            <Purchases
              purchasesForCurrentProduct={purchasesForCurrentProduct}
            />
          </div>
        </article>
        <aside className="flex flex-shrink-0 flex-col items-center border-t py-10 pr-5 md:mb-0 lg:min-h-screen lg:w-4/12 lg:items-end">
          <Image
            src={product.image.url}
            alt={product.name}
            width={300}
            height={300}
          />
          <div className="pt-10">
            <span className="block pb-4 text-sm font-semibold uppercase">
              Workshops
            </span>
            {product.modules.map((module) => {
              return (
                <ModuleProgressProvider moduleSlug={module.slug}>
                  <ModuleItem module={module} />
                </ModuleProgressProvider>
              )
            })}
          </div>
        </aside>
      </main>
    </Layout>
  )
}

export default PurchasedProductTemplate

const Upgrade: React.FC<{
  purchase: Purchase
  product: SanityProduct
  userId: string | undefined
  purchaseToUpgrade: any
  formattedPrice: FormattedPrice | undefined
  formattedPriceStatus: QueryStatus
}> = ({formattedPrice, userId, formattedPriceStatus}) => {
  const formActionPath = buildStripeCheckoutPath({
    userId,
    quantity: formattedPrice?.quantity,
    productId: formattedPrice?.id,
    bulk: Boolean(formattedPrice?.bulk),
    couponId: formattedPrice?.appliedMerchantCoupon?.id,
    upgradeFromPurchaseId: formattedPrice?.upgradeFromPurchaseId,
  })

  return (
    <div>
      <p className="pb-3">
        You've purchased a regional license for lower price. You can upgrade to
        get full access to all materials and bonuses from anywhere in the world.
      </p>
      <form
        action={formActionPath}
        method="POST"
        className="mt-4 flex w-full items-center justify-between gap-3 rounded border bg-white p-5 dark:bg-gray-900"
      >
        <PriceDisplay
          className="flex [&_[data-full-price]]:line-through [&_[data-percent-off]]:text-primary dark:[&_[data-percent-off]]:text-blue-300 [&_[data-price-discounted]]:flex [&_[data-price-discounted]]:items-center [&_[data-price-discounted]]:gap-2 [&_[data-price-discounted]]:pl-3 [&_[data-price-discounted]]:text-base [&_[data-price-discounted]]:font-medium [&_[data-price]]:flex [&_[data-price]]:text-2xl [&_[data-price]]:font-bold [&_sup]:top-2.5 [&_sup]:pr-1 [&_sup]:opacity-75"
          formattedPrice={formattedPrice}
          status={formattedPriceStatus}
        />
        <Button type="submit">Upgrade to full license</Button>
      </form>
    </div>
  )
}

const ModuleItem: React.FC<{
  module: SanityProductModule
}> = ({module}) => {
  const moduleProgress = useModuleProgress()
  const {sections, slug} = module
  const isModuleInProgress = (moduleProgress?.completedLessonCount || 0) > 0
  const nextSection = moduleProgress?.nextSection
  const nextLesson = moduleProgress?.nextLesson

  const firstSection = sections && sections[0]
  const firstLesson = firstSection?.lessons && firstSection?.lessons[0]

  return (
    <div className="flex items-center gap-3 py-2">
      {module.image.url && (
        <Image
          src={module.image.url}
          alt={module.title}
          width={80}
          height={80}
        />
      )}
      <div className="flex flex-col">
        <Link
          href={`/${pluralize(module.moduleType)}/${module.slug}`}
          className="font-medium hover:underline"
        >
          {module.title}
        </Link>
        <div className="text-sm text-gray-300">
          {module.sections && (
            <span>
              {module?.sections.length > 1 &&
                `${module.sections.length} sections`}
            </span>
          )}{' '}
          {module?.sections && module?.lessons && (
            <span>
              {sectionsFlatMap(module?.sections).length ||
                module?.lessons.length}{' '}
              lessons
            </span>
          )}
        </div>
        <div className="pt-0.5">
          {isModuleInProgress && (
            <>
              <Link
                href={
                  firstSection && sections
                    ? {
                        pathname: `/${pluralize(
                          module.moduleType,
                        )}/[module]/[section]/[lesson]`,
                        query: {
                          module: slug,
                          section: isModuleInProgress
                            ? nextSection?.slug
                            : firstSection.slug,
                          lesson: isModuleInProgress
                            ? nextLesson?.slug
                            : firstLesson?.slug,
                        },
                      }
                    : {
                        pathname: `/${pluralize(
                          module.moduleType,
                        )}/[module]/[lesson]`,
                        query: {
                          module: slug,
                          lesson: isModuleInProgress
                            ? nextLesson?.slug
                            : firstLesson?.slug,
                        },
                      }
                }
                className={cx('flex font-medium text-cyan-300 hover:underline')}
                onClick={() => {
                  track('clicked start learning', {module: slug})
                }}
              >
                {isModuleInProgress ? 'Continue' : 'Start'}
              </Link>
              <div className="relative flex w-full items-center justify-between gap-1">
                <div className="pr-1 text-xs font-semibold text-gray-300">
                  {moduleProgress?.percentComplete}%
                </div>
                <div className="h-1 w-full bg-gray-800">
                  <div
                    className="h-1 bg-cyan-400"
                    style={{width: moduleProgress?.percentComplete + '%'}}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const Purchases: React.FC<{purchasesForCurrentProduct: Purchase[]}> = ({
  purchasesForCurrentProduct,
}) => {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
      <thead>
        <tr>
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold uppercase sm:pl-0"
          >
            date
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold uppercase"
          >
            seats
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold uppercase"
          >
            price
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold uppercase"
          >
            status
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold uppercase"
          >
            Invoice
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
        {purchasesForCurrentProduct.map((purchase) => {
          return <PurchaseRow purchase={purchase} key={purchase.id} />
        })}
      </tbody>
    </table>
  )
}

const PurchaseRow: React.FC<{purchase: Purchase}> = ({purchase}) => {
  const {data: chargeDetails, status} = trpc.invoices.getChargeDetails.useQuery(
    {
      merchantChargeId: purchase.merchantChargeId as string,
    },
  )

  const quantity = chargeDetails?.result?.quantity ?? 1

  return (
    <tr key={purchase.id}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-base font-medium sm:pl-0">
        {format(new Date(purchase.createdAt), 'MMMM dd, y')}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-base">
        {status === 'loading' ? <Spinner className="w-4" /> : quantity}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-base">
        <Price amount={Number(purchase.totalAmount)} />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-base">
        {purchase.status === 'Restricted'
          ? 'Region restricted'
          : purchase.status}
      </td>
      <td className="flex justify-end whitespace-nowrap py-4 pl-3 text-base">
        <Button size="sm" asChild variant="secondary" className="w-full">
          <Link href={`/invoices/${purchase.merchantChargeId}`}>View</Link>
        </Button>
        {/* <br />
        <button
          className="text-cyan-300 underline"
          type="button"
          onClick={() => {
            alert('not implemented')
          }}
        >
          Download
        </button> */}
      </td>
    </tr>
  )
}

const Row: React.FC<
  React.PropsWithChildren<{label: string; icon: IconNames}>
> = ({children, label = 'Label', icon = null}) => {
  return children ? (
    <div className="flex w-full items-start justify-between px-3 py-4">
      <div className="flex items-center gap-2 text-gray-200">
        {icon && <Icon className="text-gray-500" name={icon} />} {label}
      </div>
      <div className="w-2/4 text-left font-medium">{children}</div>
    </div>
  ) : null
}

export const Price: React.FC<{
  amount: number
  className?: string
  withUsd?: boolean
}> = ({amount, className = '', withUsd = true}) => {
  const {dollars, cents} = formatUsd(amount)
  return (
    <div className={className}>
      {withUsd && (
        <sup className="relative !top-0.5 pr-0.5 text-gray-300">USD</sup>
      )}
      <span className="font-medium">{dollars}</span>
      <sup className="!top-0.5 pl-0.5 text-xs text-gray-300">{cents}</sup>
    </div>
  )
}

export const DatePurchased: React.FC<{date: string}> = ({date}) => {
  return <>{format(new Date(date), 'MMMM dd, y')}</>
}

export const formatUsd = (amount: number = 0) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  const formattedPrice = formatter.format(amount).split('.')

  return {dollars: formattedPrice[0], cents: formattedPrice[1]}
}

const sectionsFlatMap = (sections: any[]) => {
  const map = sections.flatMap((section) => {
    return section.lessons || []
  })

  return map
}

const H2: React.FC<React.PropsWithChildren<{className?: string}>> = ({
  children,
  className,
}) => {
  return (
    <h2
      className={cn(
        "relative mt-4 flex items-center pb-3 pt-10 text-lg font-semibold text-black after:ml-5 after:h-px after:w-full after:bg-gray-200 after:content-[''] dark:text-white dark:after:bg-gray-800 sm:text-xl",
        className,
      )}
    >
      <span className="flex-shrink-0">{children}</span>
    </h2>
  )
}

export const PurchasedBadge = () => {
  return (
    <div className="inline-flex rounded-full border border-emerald-600/75 bg-gradient-to-tr from-teal-500 to-emerald-500 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide text-white shadow-inner dark:border-emerald-500 dark:from-teal-600 dark:to-emerald-600">
      <span className="drop-shadow-md">purchased</span>
    </div>
  )
}
