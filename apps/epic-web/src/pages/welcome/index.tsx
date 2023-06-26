import * as React from 'react'
import {DocumentTextIcon, UserGroupIcon} from '@heroicons/react/outline'
import {
  convertToSerializeForNextResponse,
  stripeData,
} from '@skillrecordings/commerce-server'
import {useSession} from 'next-auth/react'
import {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import Layout from 'components/app/layout'
import {getSdk, prisma} from '@skillrecordings/database'
import Link from 'next/link'
import {first, isString} from 'lodash'
import InviteTeam from '@skillrecordings/skill-lesson/team'
import {InvoiceCard} from 'pages/invoices'
import MuxPlayer from '@mux/mux-player-react'
import {SanityDocument} from '@sanity/client'
import Image from 'next/legacy/image'
import {trpc} from '../../trpc/trpc.client'
import {Transfer} from 'purchase-transfer/purchase-transfer'
import {getProduct} from 'lib/products'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const {purchaseId: purchaseQueryParam, session_id, upgrade} = query
  const token = await getToken({req})
  const {getPurchaseDetails} = getSdk()

  let purchaseId = purchaseQueryParam

  if (session_id) {
    const {stripeChargeId} = await stripeData({
      checkoutSessionId: session_id as string,
    })
    const purchase = await prisma.purchase.findFirst({
      where: {
        merchantCharge: {
          identifier: stripeChargeId,
        },
      },
    })

    if (purchase) {
      purchaseId = purchase.id
    } else {
      return {
        redirect: {
          destination: `/thanks/purchase?session_id=${session_id}`,
          permanent: false,
        },
      }
    }
  }

  if (token && isString(purchaseId) && isString(token?.sub)) {
    const {purchase, existingPurchase, availableUpgrades} =
      await getPurchaseDetails(purchaseId, token.sub)

    if (purchase) {
      const product = await getProduct(purchase.product.id)

      return {
        props: {
          product,
          purchase: convertToSerializeForNextResponse(purchase),
          existingPurchase,
          availableUpgrades,
          upgrade: upgrade === 'true',
        },
      }
    } else {
      return {
        redirect: {
          destination: `/`,
          permanent: false,
        },
      }
    }
  }

  return {
    redirect: {
      destination: `/`,
      permanent: false,
    },
  }
}

type Purchase = {
  id: string
  merchantChargeId: string | null
  bulkCoupon: {id: string; maxUses: number; usedCount: number} | null
  product: {id: string; name: string}
}

type PersonalPurchase = {
  id: string
  product: {
    id: string
    name: string
  }
}

const Welcome: React.FC<
  React.PropsWithChildren<{
    purchase: Purchase
    existingPurchase: {
      id: string
      product: {id: string; name: string}
    }
    token: any
    availableUpgrades: {upgradableTo: {id: string; name: string}}[]
    upgrade: boolean
    product?: SanityDocument
  }>
> = ({
  upgrade,
  purchase,
  token,
  existingPurchase,
  availableUpgrades,
  product,
}) => {
  const {data: session, status} = useSession()
  const [personalPurchase, setPersonalPurchase] = React.useState<
    PersonalPurchase | Purchase
  >(purchase.bulkCoupon ? existingPurchase : purchase)

  const redemptionsLeft =
    purchase.bulkCoupon &&
    purchase.bulkCoupon.maxUses > purchase.bulkCoupon.usedCount

  const hasCharge = Boolean(purchase.merchantChargeId)

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

  return (
    <Layout meta={{title: `Welcome to ${process.env.NEXT_PUBLIC_SITE_TITLE}`}}>
      <main
        className="mx-auto flex w-full flex-grow flex-col items-center justify-center px-5 pb-32 pt-10"
        id="welcome"
      >
        <div className="flex w-full max-w-screen-md flex-col gap-3">
          <Header
            product={product}
            upgrade={upgrade}
            purchase={purchase}
            personalPurchase={personalPurchase}
          />
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="font-heading pb-2 text-sm font-black uppercase">
                Share {purchase.product.name}
              </h2>
              <Share productName={purchase.product.name} />
            </div>
            {redemptionsLeft && (
              <div>
                <h2 className="font-heading pb-2 text-sm font-black uppercase">
                  Invite your team
                </h2>
                <Invite
                  setPersonalPurchase={setPersonalPurchase}
                  session={session}
                  purchase={purchase}
                  existingPurchase={existingPurchase}
                />
              </div>
            )}
            {hasCharge && (
              <div>
                <h2 className="font-heading pb-2 text-sm font-black uppercase">
                  Get your invoice
                </h2>
                <InvoiceCard purchase={purchase} />
              </div>
            )}
            {isTransferAvailable && purchaseUserTransfers && (
              <div>
                <h2 className="font-heading pb-2 text-sm font-black uppercase">
                  Transfer this purchase to another email address
                </h2>
                <Transfer
                  purchaseUserTransfers={purchaseUserTransfers}
                  refetch={refetch}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  )
}

const Header: React.FC<
  React.PropsWithChildren<{
    upgrade: boolean
    purchase: Purchase
    personalPurchase?: PersonalPurchase | Purchase
    product?: SanityDocument
  }>
> = ({upgrade, purchase, product, personalPurchase}) => {
  return (
    <header>
      <div className="flex flex-col items-center gap-10 pb-8 sm:flex-row">
        {product?.image && (
          <div className="flex flex-shrink-0 items-center justify-center">
            <Image
              src={product.image}
              alt={product.title}
              width={250}
              height={250}
            />
          </div>
        )}
        <div className="flex flex-col items-start">
          <h1 className="font-heading text-3xl font-black sm:text-3xl lg:text-4xl">
            <span className="font-heading text-brand-red block pb-4 text-sm font-black uppercase">
              {upgrade ? `You've Upgraded ` : `Welcome to `}
            </span>
            {purchase.product.name}
          </h1>
        </div>
      </div>
      {/* {purchase.bulkCoupon
        ? `${purchase.product?.name} team license!`
        : `${purchase.product?.name} license!`} */}
    </header>
  )
}

const Invite: React.FC<React.PropsWithChildren<any>> = ({
  setPersonalPurchase,
  session,
  purchase,
  existingPurchase,
}) => {
  return (
    <InviteTeam
      setPersonalPurchase={setPersonalPurchase}
      session={session}
      purchase={purchase}
      existingPurchase={existingPurchase}
    />
  )
}

const Share: React.FC<React.PropsWithChildren<{productName: string}>> = ({
  productName,
}) => {
  const tweet = `https://twitter.com/intent/tweet/?text=Epic Web by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER} 🚀 https%3A%2F%2Fwww.epicweb.dev%2F`
  return (
    <div className="flex flex-col justify-between gap-5 rounded-lg border border-gray-100  px-5 py-6 shadow-xl shadow-gray-400/5 sm:flex-row sm:items-center">
      <p>
        Tell your friends about {process.env.NEXT_PUBLIC_SITE_TITLE},{' '}
        <br className="hidden sm:block" />
        it would help me to get a word out.{' '}
        <span role="img" aria-label="smiling face">
          😊
        </span>
      </p>
      <a
        href={tweet}
        rel="noopener noreferrer"
        target="_blank"
        className="font-heading flex items-center gap-2 self-start rounded-full border border-sky-500 px-5 py-2.5 font-semibold text-sky-500 transition hover:bg-sky-500 hover:text-white"
      >
        <TwitterIcon /> Share with your friends!
      </a>
    </div>
  )
}

export const TwitterIcon = () => (
  <svg
    aria-hidden="true"
    height="16"
    width="16"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="currentColor">
      <path d="M16,3c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.5-1-2.4-1 C9.3,1.5,7.8,3,7.8,4.8c0,0.3,0,0.5,0.1,0.7C5.2,5.4,2.7,4.1,1.1,2.1c-0.3,0.5-0.4,1-0.4,1.7c0,1.1,0.6,2.1,1.5,2.7 c-0.5,0-1-0.2-1.5-0.4c0,0,0,0,0,0c0,1.6,1.1,2.9,2.6,3.2C3,9.4,2.7,9.4,2.4,9.4c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3 c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4C15,4.3,15.6,3.7,16,3z" />
    </g>
  </svg>
)

export default Welcome
