import {z} from 'zod'
import {Context, getSdk} from '@skillrecordings/database'
import type {MerchantCoupon} from '@skillrecordings/database'
import {getPPPDiscountPercent} from './parity-coupon'

export class MerchantCouponError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PriceFormattingError'
  }
}

const PrismaCtxSchema: z.ZodType<Context> = z.any()

const DetermineCouponToApplyParamsSchema = z.object({
  prismaCtx: PrismaCtxSchema,
  merchantCouponId: z.string().optional(),
  country: z.string(),
  quantity: z.number(),
  userId: z.string().optional(),
})

type DetermineCouponToApplyParams = z.infer<
  typeof DetermineCouponToApplyParamsSchema
>

const SPECIAL_TYPE = 'special' as const
const PPP_TYPE = 'ppp' as const
const BULK_TYPE = 'bulk' as const
const NONE_TYPE = 'none' as const

// We are trying to determine:
// - what coupon is validly applied
//   - type
//   - merchantCoupon object
// - what other coupons are available
//   e.g. site-wide defaults, but PPP is available
// -

// If the coupon to be applied is PPP, but PPP is invalid, then
// return `NONE_TYPE` and `undefined` for the `appliedMerchantCoupon`

// If the applied coupon (e.g. site-wide discount) provides a greater
// discount than PPP would be able to, then we don't even offer PPP.

// If the applied coupon (e.g. site-wide discount) provides a greater
// discount than BULK would be able to, then we don't apply bulk discount.

export const determineCouponToApply = async (
  params: DetermineCouponToApplyParams,
) => {
  const {prismaCtx, merchantCouponId, country, quantity, userId} =
    DetermineCouponToApplyParamsSchema.parse(params)

  if (merchantCouponId === undefined) {
    return undefined
  }

  const {getMerchantCoupon, getPurchasesForUser} = getSdk({ctx: prismaCtx})

  const appliedMerchantCoupon = await getMerchantCoupon({
    where: {id: merchantCouponId},
  })

  const userPurchases = await getPurchasesForUser(userId)

  // NOTE: `pppApplied` vs `pppAvailable`

  // QUESTION: Should this include `applied` and `available`?
  // Then, for example, if we determine that PPP isn't valid because of
  // the quantity, then we remove PPP Coupon from both the `applied` and
  // `available` coupon result.
  const pppDetails = getPPPDetails({appliedMerchantCoupon, country, quantity})

  // NOTE: maybe return an 'error' result instead of throwing?
  if (pppDetails.status === INVALID_PPP) {
    // Throw coupon error and then repackage in caller as a PriceFormattingError
    throw new MerchantCouponError('coupon-not-valid-for-ppp')
  }

  return {pppDetails}
}

const MerchantCouponSchema: z.ZodType<MerchantCoupon> = z.any()
const GetPPPDetailsParamsSchema = z.object({
  appliedMerchantCoupon: MerchantCouponSchema.nullable(),
  quantity: z.number(),
  country: z.string(),
})
type GetPPPDetailsParams = z.infer<typeof GetPPPDetailsParamsSchema>

const NO_PPP = 'NO_PPP' as const
const INVALID_PPP = 'INVALID_PPP' as const
const VALID_PPP = 'VALID_PPP' as const

const getPPPDetails = ({
  appliedMerchantCoupon,
  country,
  quantity,
}: GetPPPDetailsParams) => {
  if (appliedMerchantCoupon?.type !== 'ppp') {
    return {
      status: NO_PPP,
      pppApplied: false,
    }
  }

  const expectedPPPDiscountPercent = getPPPDiscountPercent(country)

  // Check PPP coupon validity
  const couponPercentDoesNotMatchCountry =
    expectedPPPDiscountPercent !==
    appliedMerchantCoupon.percentageDiscount.toNumber()
  const couponPercentOutOfRange =
    expectedPPPDiscountPercent <= 0 || expectedPPPDiscountPercent >= 1
  const pppAppliedToBulkPurchase = quantity > 1
  const invalidCoupon =
    couponPercentDoesNotMatchCountry ||
    couponPercentOutOfRange ||
    pppAppliedToBulkPurchase

  // Build `details` with all kinds of intermediate stuff as part of this refactoring
  const pppApplied =
    quantity === 1 &&
    appliedMerchantCoupon?.type === 'ppp' &&
    expectedPPPDiscountPercent > 0

  const details = {pppApplied}

  if (invalidCoupon) {
    return {
      status: INVALID_PPP,
      ...details,
    }
  }

  return {
    status: VALID_PPP,
    ...details,
  }
}
