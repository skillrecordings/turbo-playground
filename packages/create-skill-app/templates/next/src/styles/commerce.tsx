import {cn} from '@skillrecordings/ui/utils/cn'

export const pricingClassNames = cn('', {
  // card
  '[&_article]:x-[flex,flex-col,gap-5]': true,
  // title,
  '[&_[data-title]]:x-[pb-5,font-semibold] [&_[data-name-badge]]:x-[pb-5,font-semibold]':
    true,
  // byline (full access)
  '[&_[data-byline]]:x-[text-sm,text-muted-foreground]': true,
  // price
  '[&_[data-price-container]>sup]:mt-0 [&_[data-price-container]]:x-[flex,items-center] [&_[data-price]>span]:x-[mt-0.5,text-xs] [&_[data-price]]:x-[flex,text-2xl,font-semibold] [&_svg]:text-muted-foreground':
    true,
  // button
  '[&_[data-pricing-product-checkout-button]]:x-[px-5,flex,bg-primary,py-2.5,text-primary-foreground,rounded,font-semibold]':
    true,
  // team switch
  '[&_[data-team-switch]>label]:x-[sr-only] [&_[data-team-switch]]:x-[flex,gap-2] [&_button[role="button"]]:x-[text-sm] [&_button[role="switch"]>span]:x-[block,h-[18px],w-[18px],translate-x-[2px],rounded-full,bg-muted-foreground,transition-all,will-change-transform] [&_button[role="switch"]]:x-[relative,h-6,w-[47px],rounded-full,border]':
    true,
  // team switch checked
  '[&_button[role="switch"]>span[data-state="checked"]]:x-[translate-x-[25px],bg-muted-foreground] [&_button[role="switch"][data-state="checked"]]:x-[bg-muted]':
    true,
  // seats quantity
  '[&_[data-quantity-input]>div]:x-[flex,items-center] [&_[data-quantity-input]_button:first-of-type]:x-[rounded-l-full] [&_[data-quantity-input]_button:last-of-type]:x-[rounded-r-full] [&_[data-quantity-input]_button]:x-[w-7,h-7,bg-muted,border,flex,items-baseline,justify-center,text-center] [&_[data-quantity-input]_input]:x-[px-3,h-7,tabular-nums,text-sm,bg-muted,border-y] [&_[data-quantity-input]_label]:x-[pr-2,text-sm]':
    true,
  // purchase container
  '[&_form>fieldset]:x-[flex,flex-col,gap-3,items-start,py-5,border-y]': true,
  // footer
  '[&_[data-pricing-footer]]:x-[flex,flex-col,gap-3]': true,
  // footer "includes" label
  '[&_[data-pricing-footer]>[data-header]_span]:x-[uppercase,text-xs,tracking-wide,text-muted-foreground,font-medium]':
    true,
  // workshops
  '[&_[data-workshops]>strong]:x-[sr-only] [&_[data-workshops]_[data-state="draft"]]:x-[text-sm,text-muted-foreground]':
    true,
})
