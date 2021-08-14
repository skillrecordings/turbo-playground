import {SellableResource} from '@skillrecordings/types'
import {useViewer} from '@skillrecordings/viewer'
import find from 'lodash/find'
import useSWR from 'swr'
import Axios from 'axios'

const fetcher = (url: string, token: string) => {
  return Axios.get(url, {headers: {Authorization: `Bearer ${token}`}})
}

export const usePurchasedBundle = (
  bundles: SellableResource[],
): SellableResource | undefined => {
  const {sitePurchases} = useViewer()
  const purchasedBundle = find(bundles, {slug: sitePurchases[0]?.slug})
  const purchasedUrl = purchasedBundle?.url
  const swrKey = purchasedUrl ? [purchasedUrl] : null
  const {data} = useSWR(swrKey, fetcher)

  return data?.data
}
