import {getPPPDiscountPercent} from './parity-coupon'
import {getBulkDiscountPercent} from './bulk-coupon'
import {getCalculatedPriced} from './get-calculated-price'
import {Context, defaultContext, getSdk} from '@skillrecordings/database'
import {FormattedPrice} from './@types'
import {Purchase} from '@prisma/client'
import {getStripeSdk} from '@skillrecordings/stripe-sdk'
import * as console from 'console'

// 10% premium for an upgrade
// TODO: Display Coupon Errors
// TODO: Display Applied Site Coupon w/ Expiration
// departure from the three tiers we've used in the past and the third tier
// is for teams

export class PriceFormattingError extends Error {
  options: FormatPricesForProductOptions

  constructor(message: string, options: FormatPricesForProductOptions) {
    super(message)
    this.name = 'PriceFormattingError'
    this.options = options
  }
}

type FormatPricesForProductOptions = {
  productId: string
  country?: string
  quantity?: number
  code?: string
  merchantCouponId?: string
  ctx?: Context
  upgradeFromPurchaseId?: string
  userId?: string
}

async function getFixedDiscountForUpgrade({
  upgradeProductId,
  ctx = defaultContext,
}: {
  upgradeProductId: string
  ctx: Context
}) {
  const {getPrice} = getSdk({ctx})
  if (upgradeProductId) {
    const price = await getPrice({
      where: {
        productId: upgradeProductId,
      },
    })
    return price?.unitAmount.toNumber() || 0
  }
  return 0
}

/**
 * Creates a verified price for a given product based on the unit price
 * of the product, coupons, and other factors.
 *
 * 30 minute loom walkthrough of this function:
 * https://www.loom.com/share/8cbd2213d44145dea51590b380f5d0d7?sid=bec3caeb-b742-4425-ae6e-81ca98c88f91
 *
 * @param {FormatPricesForProductOptions} options the Prisma context
 */
export async function formatPricesForProduct(
  options: FormatPricesForProductOptions,
): Promise<FormattedPrice> {
  const {ctx = defaultContext, ...noContextOptions} = options
  const {
    productId,
    country = 'US',
    quantity = 1,
    code,
    merchantCouponId,
    upgradeFromPurchaseId,
    userId,
  } = noContextOptions

  const {
    getProduct,
    getMerchantCoupon,
    couponForIdOrCode,
    getPrice,
    getPurchase,
  } = getSdk({ctx})

  const upgradeFromPurchase = upgradeFromPurchaseId
    ? await getPurchase({
        where: {
          id: upgradeFromPurchaseId,
        },
        select: {
          id: true,
          bulkCoupon: {
            select: {
              id: true,
            },
          },
          redeemedBulkCouponId: true,
          totalAmount: true,
          productId: true,
        },
      })
    : false

  const fixedDiscountForUpgrade = upgradeFromPurchase
    ? await getFixedDiscountForUpgrade({
        upgradeProductId: upgradeFromPurchase.productId,
        ctx,
      })
    : 0

  const product = await getProduct({
    where: {id: productId},
    include: {
      prices: true,
    },
  })

  if (!product) {
    throw new PriceFormattingError(`no-product-found`, noContextOptions)
  }

  const price = await getPrice({where: {productId}})

  if (!price) throw new PriceFormattingError(`no-price-found`, noContextOptions)

  // Determine if the user has an existing bulk purchase of this product.
  // If so, we can compute tiered pricing based on their existing seats purchased.
  const seatCount = await getQualifyingSeatCount({
    userId,
    productId: product.id,
    newPurchaseQuantity: quantity,
    ctx,
  })

  const pppDiscountPercent = getPPPDiscountPercent(country)
  const bulkCouponPercent = getBulkDiscountPercent(seatCount)

  // if there's a coupon implied because an id is passed in, load it to verify
  const appliedMerchantCoupon = merchantCouponId
    ? await getMerchantCoupon({where: {id: merchantCouponId}})
    : undefined

  const pppApplied =
    quantity === 1 &&
    appliedMerchantCoupon?.type === 'ppp' &&
    pppDiscountPercent > 0

  // pick the bigger discount during a sale
  const appliedMerchantCouponLessThanPPP = appliedMerchantCoupon
    ? appliedMerchantCoupon.percentageDiscount.toNumber() < pppDiscountPercent
    : true
  const appliedMerchantCouponLessThanBulk = appliedMerchantCoupon
    ? appliedMerchantCoupon.percentageDiscount.toNumber() < bulkCouponPercent
    : true

  const pppAvailable =
    quantity === 1 && pppDiscountPercent > 0 && appliedMerchantCouponLessThanPPP
  const bulkDiscountAvailable =
    bulkCouponPercent > 0 && appliedMerchantCouponLessThanBulk && !pppApplied

  let defaultPriceProduct: FormattedPrice = {
    ...product,
    quantity,
    unitPrice: price.unitAmount.toNumber(),
    calculatedPrice: getCalculatedPriced({
      unitPrice: price.unitAmount.toNumber(),
      ...(upgradeFromPurchase && {
        fixedDiscount: fixedDiscountForUpgrade,
      }),
      quantity,
    }),
    availableCoupons: [],
    ...(upgradeFromPurchase && {
      upgradeFromPurchaseId,
      upgradeFromPurchase,
    }),
  }

  if (appliedMerchantCoupon?.type === 'special') {
    defaultPriceProduct = {
      ...defaultPriceProduct,
      calculatedPrice: getCalculatedPriced({
        unitPrice: defaultPriceProduct.unitPrice,
        percentOfDiscount: appliedMerchantCoupon.percentageDiscount.toNumber(),
        ...(upgradeFromPurchase && {
          fixedDiscount: fixedDiscountForUpgrade,
        }),
        quantity,
      }),
      appliedMerchantCoupon: appliedMerchantCoupon,
      ...(upgradeFromPurchase && {
        upgradeFromPurchaseId,
        upgradeFromPurchase,
      }),
    }
  }

  // no ppp or bulk if you're applying a code
  if (code) {
    const coupon = await couponForIdOrCode({code})

    if (!coupon || !coupon.merchantCoupon)
      throw new PriceFormattingError(`no-coupon`, noContextOptions)

    if (coupon && coupon.merchantCoupon) {
      if (coupon.restrictedToProductId !== productId) {
        throw new PriceFormattingError(
          'coupon-not-valid-for-product',
          noContextOptions,
        )
      }

      const {merchantCoupon} = coupon

      const calculatedPrice = getCalculatedPriced({
        unitPrice: defaultPriceProduct.unitPrice,
        percentOfDiscount: merchantCoupon.percentageDiscount.toNumber(),
        ...(upgradeFromPurchase && {
          fixedDiscount: fixedDiscountForUpgrade,
        }),
      })

      return {
        ...defaultPriceProduct,
        calculatedPrice,
        appliedMerchantCoupon: merchantCoupon,
        ...(upgradeFromPurchase && {
          upgradeFromPurchaseId,
          upgradeFromPurchase,
        }),
      }
    }
  } else if (appliedMerchantCoupon && pppApplied) {
    const invalidCoupon =
      pppDiscountPercent !== appliedMerchantCoupon.percentageDiscount.toNumber()

    if (invalidCoupon || appliedMerchantCoupon.type !== 'ppp')
      throw new PriceFormattingError(
        'coupon-not-valid-for-ppp',
        noContextOptions,
      )

    const {identifier, merchantAccountId, ...merchantCouponWithoutIdentifier} =
      appliedMerchantCoupon

    return {
      ...defaultPriceProduct,
      calculatedPrice: getCalculatedPriced({
        unitPrice: defaultPriceProduct.unitPrice,
        percentOfDiscount: appliedMerchantCoupon.percentageDiscount.toNumber(),
        ...(upgradeFromPurchase && {
          fixedDiscount: fixedDiscountForUpgrade,
        }),
      }),
      appliedMerchantCoupon: merchantCouponWithoutIdentifier,
      ...(upgradeFromPurchase && {
        upgradeFromPurchaseId,
        upgradeFromPurchase,
      }),
    }
  } else if (
    appliedMerchantCoupon &&
    appliedMerchantCoupon.type === 'special' &&
    pppAvailable
  ) {
    // PPP + site coupon
    const pppCoupons = await couponForType(
      'ppp',
      pppDiscountPercent,
      ctx,
      country,
    )

    const {identifier, merchantAccountId, ...merchantCouponWithoutIdentifier} =
      appliedMerchantCoupon

    return {
      ...defaultPriceProduct,
      calculatedPrice: getCalculatedPriced({
        unitPrice: defaultPriceProduct.unitPrice,
        percentOfDiscount: appliedMerchantCoupon.percentageDiscount.toNumber(),
        ...(upgradeFromPurchase && {
          fixedDiscount: fixedDiscountForUpgrade,
        }),
      }),
      appliedMerchantCoupon: merchantCouponWithoutIdentifier,
      availableCoupons: pppCoupons,
      ...(upgradeFromPurchase && {
        upgradeFromPurchaseId,
        upgradeFromPurchase,
      }),
    }
  } else if (pppAvailable) {
    // no PPP for bulk
    const pppCoupons = await couponForType(
      'ppp',
      pppDiscountPercent,
      ctx,
      country,
    )

    return {
      ...defaultPriceProduct,
      calculatedPrice: getCalculatedPriced({
        unitPrice: defaultPriceProduct.unitPrice,
        ...(upgradeFromPurchase && {
          fixedDiscount: fixedDiscountForUpgrade,
        }),
      }),
      availableCoupons: pppCoupons,
      ...(upgradeFromPurchase && {
        upgradeFromPurchaseId,
        upgradeFromPurchase,
      }),
    }
  } else if (bulkDiscountAvailable) {
    const bulkCoupons = await couponForType('bulk', bulkCouponPercent, ctx)
    const bulkCoupon = bulkCoupons[0]

    return {
      ...defaultPriceProduct,
      calculatedPrice: getCalculatedPriced({
        unitPrice: defaultPriceProduct.unitPrice,
        percentOfDiscount: bulkCoupon.percentageDiscount.toNumber(),
        quantity,
      }),
      ...(bulkCoupon && {appliedMerchantCoupon: bulkCoupon}),
    }
  }

  return defaultPriceProduct
}

async function couponForType(
  type: string,
  percentageDiscount: number,
  ctx: Context,
  country?: string,
) {
  const {getMerchantCoupons} = getSdk({ctx})
  const merchantCoupons =
    (await getMerchantCoupons({
      where: {type, percentageDiscount},
    })) || []

  type MerchantCoupon = (typeof merchantCoupons)[0]

  return merchantCoupons.map((coupon: MerchantCoupon) => {
    // for pricing we don't need the identifier so strip it here
    const {identifier, ...rest} = coupon
    return {...rest, ...(country && {country})}
  })
}

const getQualifyingSeatCount = async ({
  userId,
  productId: purchasingProductId,
  newPurchaseQuantity,
  ctx,
}: {
  userId: string | undefined
  productId: string
  newPurchaseQuantity: number
  ctx: Context
}) => {
  const {getPurchasesForUser} = getSdk({ctx})
  const userPurchases = await getPurchasesForUser(userId)
  const bulkPurchase = userPurchases.find(
    ({productId, bulkCoupon}) =>
      productId === purchasingProductId && Boolean(bulkCoupon),
  )
  const existingSeatsPurchasedForThisProduct =
    bulkPurchase?.bulkCoupon?.maxUses || 0

  return newPurchaseQuantity + existingSeatsPurchasedForThisProduct
}
