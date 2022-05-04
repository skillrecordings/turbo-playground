import * as React from 'react'
import {serialize} from 'utils/prisma-next-serializer'
import {useLocalStorage} from 'react-use'
import {GetServerSideProps} from 'next'
import {Logo} from 'components/images'
import {getSdk} from 'lib/prisma-api'
import {stripe} from 'utils/stripe'
import {Stripe} from 'stripe'
import fromUnixTime from 'date-fns/fromUnixTime'
import Layout from 'components/app/layout'
import format from 'date-fns/format'
import prisma from '../../db'

export const getServerSideProps: GetServerSideProps = async ({query, res}) => {
  const {merchantChargeId} = query
  const {getProduct} = getSdk()
  if (merchantChargeId) {
    const merchantCharge = await prisma.merchantCharge.findUnique({
      where: {
        id: merchantChargeId as string,
      },
      select: {
        identifier: true,
        merchantProductId: true,
      },
    })

    if (merchantCharge && merchantCharge.identifier) {
      const charge = await stripe.charges.retrieve(merchantCharge.identifier)

      const merchantProductId = merchantCharge.merchantProductId
      const merchantProduct = await prisma.merchantProduct.findUnique({
        where: {
          id: merchantProductId as string,
        },
        select: {
          productId: true,
        },
      })
      const productId = merchantProduct?.productId
      const product = await getProduct({
        where: {id: productId},
      })

      res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
      return {
        props: {
          charge,
          product: serialize(product),
          merchantChargeId,
        },
      }
    }
  }

  return {
    redirect: {
      destination: '/invoices',
      permanent: false,
    },
  }
}

const Invoice: React.FC<{
  charge: Stripe.Charge
  product: {name: string}
  merchantChargeId: string
}> = ({charge, product, merchantChargeId}) => {
  const [invoiceMetadata, setInvoiceMetadata] = useLocalStorage(
    'invoice-metadata',
    '',
  )

  const created = fromUnixTime(charge.created)
  const date = format(created, 'MMMM d, y')
  const amount = charge.amount / 100 + '.00'
  const instructorName = 'Marcy Sutton-Todd'
  const productName = `Testing Accessibility by ${instructorName}`

  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Layout
      meta={{title: `Invoice ${merchantChargeId}`}}
      className="bg-gray-50"
    >
      <main className="max-w-screen-md mx-auto py-10">
        <div className="flex sm:flex-row flex-col items-center justify-between py-5 print:hidden">
          <h1 className="text-lg font-medium leading-tight sm:mb-0 mb-4">
            Your Invoice for {productName}
          </h1>
          <button
            onClick={() => {
              window.print()
            }}
            className="flex items-center leading-6 px-5 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors ease-in-out duration-200"
          >
            Download PDF or Print
          </button>
        </div>
        <div className="bg-white rounded-md shadow-md print:shadow-none">
          <div className="px-10 py-16">
            <div className="grid grid-cols-3 w-full justify-between items-start">
              <div className="col-span-2 flex items-center">
                <Logo className="w-8" />
                <span className="pl-2 text-lg font-semibold">
                  TestingAccessibility.com
                </span>
              </div>
              <div>
                <p className="uppercase text-xs mb-2 text-gray-500">From</p>
                <span className="font-semibold">{productName}</span>
                <br />
                co egghead.io LLC
                <br />
                337 Garden Oaks Blvd #97429
                <br />
                Houston, TX 77018
                <br />
                972-992-5951
              </div>
            </div>
            <div className="grid grid-cols-3 pb-64">
              <div className="col-span-2">
                <p className="text-2xl font-bold mb-2">Invoice</p>
                Invoice ID: <strong>{merchantChargeId}</strong>
                <br />
                Created: <strong>{date}</strong>
              </div>
              <div className="pt-12">
                <p className="uppercase text-xs mb-2 text-gray-500">
                  Invoice For
                </p>
                <div>
                  {charge.billing_details.name}
                  <br />
                  {charge.billing_details.email}
                  {/* <br />
                  {charge.billing_details.address?.city}
                  <br />
                  {charge.billing_details.address?.postal_code}
                  <br />
                  {charge.billing_details.address?.country} */}
                </div>
                {isMounted && (
                  <>
                    <textarea
                      className="print:hidden mt-4 form-textarea placeholder-gray-700 border border-gray-200 bg-gray-50 w-full h-full print:p-0 print:border-none print:bg-transparent"
                      value={invoiceMetadata}
                      onChange={(e) => setInvoiceMetadata(e.target.value)}
                      placeholder="Enter additional info here (optional)"
                    />
                    <div className="print:block hidden">{invoiceMetadata}</div>
                  </>
                )}
              </div>
            </div>
            <table className="table-auto w-full text-left">
              <thead className="table-header-group">
                <tr className="table-row">
                  <th>Description</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* {map(sitePurchases, (purchase) => (
                  <InvoiceItem key={purchase.guid} purchase={purchase} />
                ))} */}
                <tr className="table-row">
                  <td>
                    Testing Accessibility ({product.name}){/* {date} */}
                  </td>
                  <td>
                    {charge.currency.toUpperCase()} {amount}
                  </td>
                  <td>1</td>
                  <td className="text-right">
                    {amount === null
                      ? `${charge.currency.toUpperCase()} 0.00`
                      : `${charge.currency.toUpperCase()} ${amount}`}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex flex-col items-end py-16">
              <div>
                <span className="mr-3">Total</span>
                <strong>
                  {charge.currency.toUpperCase()} {amount}
                </strong>
              </div>
              <div className="font-bold">
                <span className="mr-3 text-lg">Amount Due</span>
                <strong>
                  {charge.currency.toUpperCase()} {amount}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Invoice
