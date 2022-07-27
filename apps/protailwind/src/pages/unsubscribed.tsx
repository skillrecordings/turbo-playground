import * as React from 'react'
import Layout from 'components/layout'
import {useRouter} from 'next/router'
import {Signature} from './confirm'

const Unsubscribed = () => {
  const router = useRouter()
  const sequenceId = Number(router.query?.sequence)

  const message = (sequenceId: number) => {
    switch (sequenceId) {
      case 1: // unsubscribed: email course
        return 'Pro Tailwind email course'
      case 2: // unsubscribed: live workshop info
        return 'Pro Tailwind live workshops list'
      default:
        return 'Pro Tailwind email list'
    }
  }

  return (
    <Layout>
      <main className="flex-grow flex items-center justify-center flex-col px-5">
        <div className="max-w-lg text-center font-light">
          <h1 className="font-bold lg:text-5xl text-4xl py-8 font-heading">
            Unsubscribed
          </h1>
          <p className="sm:text-xl text-slate-300 leading-relaxed mx-auto pb-8">
            You've been removed from the {message(sequenceId)} and won't receive
            any more emails about it.
          </p>
          <Signature />
        </div>
      </main>
    </Layout>
  )
}

export default Unsubscribed
