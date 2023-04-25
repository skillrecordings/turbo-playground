import React from 'react'
import Image from 'next/image'
import {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'

import Layout from 'components/layout'
import {Pricing} from 'path-to-purchase-react/pricing'
import {getActiveProducts} from 'server/products.server'
import {useCoupon} from 'path-to-purchase-react/use-coupon'
import {PriceCheckProvider} from 'path-to-purchase-react/pricing-check-context'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, query} = context
  const token = await getToken({req})
  const products = await getActiveProducts()

  return await propsForCommerce({query, token, products})
}

const Buy: React.FC<CommerceProps> = ({
  couponFromCode,
  products,
  userId,
  purchases = [],
  couponIdFromCoupon,
  allowPurchase,
}) => {
  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} =
    useCoupon(couponFromCode)

  const couponId =
    couponIdFromCoupon || (validCoupon ? couponFromCode?.id : undefined)

  const purchasedProductIds = purchases.map((purchase) => purchase.productId)

  return (
    <Layout
      meta={{
        title: `Buy ${process.env.NEXT_PUBLIC_SITE_TITLE} Workshops`,
        ogImage: {
          url: 'https://res.cloudinary.com/pro-tailwind/image/upload/v1673953704/buy-card_2x.png',
          alt: 'Professional Tailwind CSS Workshops',
        },
      }}
      className="py-16"
    >
      <header>
        <h1 className="px-5 text-center font-heading text-4xl sm:text-5xl">
          Start testing like a pro
        </h1>
        <h3 className="text-center mb-10 mt-4 font-tt-regular text-2xl opacity-80">
          Buy once. Forever yours.
        </h3>
      </header>
      <main>
        <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
          {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
          <div className="flex flex-col lg:flex-row justify-center gap-6 mt-32 items-start">
            {products.map((product, i) => {
              return (
                <Pricing
                  key={product.name}
                  userId={userId}
                  product={product}
                  purchased={purchasedProductIds.includes(product.productId)}
                  purchases={purchases}
                  index={i}
                  couponId={couponId}
                  allowPurchase={allowPurchase}
                />
              )
            })}
          </div>
        </PriceCheckProvider>
        {/* <div className="flex w-full items-center justify-center pt-16">
          <Image
            src={require('../../public/assets/money-back-guarantee-badge.svg')}
            width={130}
            height={130}
            alt="30-Day Money-Back Guarantee"
          />
        </div> */}
      </main>
    </Layout>
  )
}

export default Buy
