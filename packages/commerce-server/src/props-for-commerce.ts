import {ParsedUrlQuery} from 'querystring'
import {getSdk} from '@skillrecordings/database'
import {convertToSerializeForNextResponse} from './prisma-next-serializer'
import {getCouponForCode} from './get-coupon-for-code'
import type {SanityProduct} from './@types'
import isEmpty from 'lodash/isEmpty'

export async function propsForCommerce({
  query,
  token,
  products,
}: {
  query: ParsedUrlQuery
  token: {sub?: string} | null
  products: SanityProduct[]
}) {
  const couponFromCode = await getCouponForCode(query.code as string)
  const allowPurchase =
    Boolean(process.env.NEXT_PUBLIC_SELLING_LIVE === 'true') ||
    Boolean(query.allowPurchase)

  const {getDefaultCoupon, getPurchasesForUser} = getSdk()

  const purchases = await getPurchasesForUser(token?.sub)
  const anyPurchases = !isEmpty(purchases)

  const couponIdFromCoupon = (query.coupon as string) || couponFromCode?.id
  const defaultCoupons = !token
    ? await getDefaultCoupon(products.map((product) => product.productId))
    : null

  return {
    props: {
      ...(defaultCoupons && {
        defaultCoupon: convertToSerializeForNextResponse({
          expires: defaultCoupons.defaultCoupon.expires,
          percentageDiscount: defaultCoupons.defaultCoupon.percentageDiscount,
        }),
      }),
      ...(token?.sub ? {userId: token?.sub} : {}),
      ...(couponFromCode && {
        couponFromCode: convertToSerializeForNextResponse(couponFromCode),
      }),
      ...(couponIdFromCoupon && {couponIdFromCoupon}),
      ...(anyPurchases && {
        purchases: [
          ...purchases.map((purchase) =>
            convertToSerializeForNextResponse({
              ...purchase,
              totalAmount:
                // because serializer doesnt handle 0.00
                typeof purchase.totalAmount === 'object'
                  ? purchase.totalAmount.toNumber()
                  : purchase.totalAmount,
            }),
          ),
        ],
      }),
      products,
      allowPurchase,
    },
  }
}
