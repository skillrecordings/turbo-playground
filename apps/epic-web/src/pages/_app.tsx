import React from 'react'
import {AppProps} from 'next/app'
import '../styles/globals.css'
import '../styles/fonts.css'
import 'focus-visible'
import {ConvertkitProvider} from '@skillrecordings/convertkit'
import {usePageview} from '@skillrecordings/analytics'
import {initNProgress} from '@skillrecordings/react'
import {DefaultSeo} from '@skillrecordings/next-seo'

import config from '../config'

initNProgress()

function MyApp({Component, pageProps}: AppProps) {
  usePageview()
  return (
    <>
      <DefaultSeo {...config} />
      <ConvertkitProvider>
        <Component {...pageProps} />
      </ConvertkitProvider>
    </>
  )
}

export default MyApp
