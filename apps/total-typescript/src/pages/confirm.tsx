import React from 'react'
import Layout from 'components/app/layout'
import config from 'config'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {get} from 'lodash'

const ConfirmSubscriptionPage = () => {
  const router = useRouter()
  const source = router.query.source || 'default'
  const email = router.query.email

  const data = {
    video: {
      title: 'Confirm your subscription',
      description: (
        <>
          A confirmation email was sent to {email ? email : 'your inbox'}.
          Please click the confirmation button in this email to confirm your
          subscription and start watching videos. If you don't see the email
          after a few minutes, you might check your spam folder or other filters
          and add <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong> to
          your contacts.
        </>
      ),
    },
    default: {
      title: 'Please check your inbox for an email that just got sent.',
      description: (
        <>
          You'll need to click the confirmation link to receive any further
          emails. If you don't see the email after a few minutes, you might
          check your spam folder or other filters and add{' '}
          <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong> to your
          contacts.
        </>
      ),
    },
  }

  return (
    <Layout meta={{title: 'Confirm your subscription'}}>
      <main className="flex-grow flex items-center justify-center flex-col px-5 py-24">
        <div className="sm:px-0 px-10">
          <Image
            src={require('../../public/assets/email-confirm.svg')}
            alt="confirm your email address"
          />
        </div>
        <div className="max-w-xl text-center">
          <h1 className="font-bold sm:text-4xl text-3xl py-8 font-text max-w-lg mx-auto w-full">
            {get(data, source).title}
          </h1>
          <p className="sm:text-lg leading-relaxed mx-auto pb-8 text-gray-200">
            {get(data, source).description}
          </p>
          <p className="sm:text-lg text-gray-200">
            Thanks, <br />
            <Signature />
          </p>
        </div>
      </main>
    </Layout>
  )
}

export default ConfirmSubscriptionPage

export const Signature = () => {
  return (
    <svg
      className="pt-4 w-32 mx-auto -rotate-6 text-sky-300"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 154 34"
    >
      <title>{config.author}</title>
      <path
        fill="currentColor"
        d="M.002 20.16c.065 1.113.589 1.964 1.505 2.553 1.637.982 4.517.654 7.986-.982 8.378-3.927 13.483-11.062 13.549-11.127.13-.197.13-.458-.066-.59a.426.426 0 0 0-.589.132c-.065.065-5.105 7.003-13.287 10.8-3.142 1.505-5.76 1.832-7.2 1.047C1.245 21.6.918 20.946.853 20.16c-.066-1.833 1.767-4.975 4.843-8.247C10.867 6.415 19.311.85 26.446.85c1.177 0 1.897.393 2.225 1.047 2.16 4.778-13.353 23.957-19.506 30.96-.13.197-.13.458 0 .59.131.065.197.13.328.13a.497.497 0 0 0 .261-.13c.197-.197 20.095-20.619 31.419-31.419-1.768 3.666-6.48 12.306-10.277 18.785-2.945 3.535-5.76 7.266-5.76 8.182a.5.5 0 0 0 .131.328c.066.13.262.196.393.196.327 0 1.113 0 5.956-8.313 1.244-1.44 2.553-3.01 4.058-4.713C42.024 9.23 45.885 5.76 46.867 5.498c-.065.786-1.57 3.47-2.945 5.891-3.797 6.677-9.557 16.887-6.415 21.47.131.13.393.195.59.065a.426.426 0 0 0 .13-.59c-2.88-4.123 2.684-14.007 6.415-20.552 2.618-4.517 3.403-6.087 2.945-6.807a.654.654 0 0 0-.589-.328c-1.898 0-9.033 7.986-12.044 11.39-.327.327-.654.72-.981 1.112.261-.458.523-.916.785-1.44 3.796-6.742 7.658-14.073 7.92-15.054.131-.393-.065-.524-.196-.59-.131-.065-.328-.13-.524.066-7.004 6.61-18.262 17.934-25.593 25.396C22.78 17.477 31.224 5.63 29.391 1.571 28.933.524 27.95.065 26.445.065c-7.396 0-16.101 5.63-21.403 11.259C1.769 14.793-.064 18.13.002 20.16Zm54.935 2.03c.524 1.112 1.964 3.73 5.498 3.73 4.647 0 10.211-3.273 10.473-3.404.196-.13.262-.392.065-.589-.13-.196-.392-.261-.523-.13-.066.065-5.63 3.272-10.015 3.272-4.123 0-4.909-3.665-4.909-3.796-.065-.131-.196-.262-.327-.262-.131-.066-.328 0-.393.065-.065.066-.13.197-.262.262-.327-.196-.85-.393-1.898-.393-1.374 0-2.684 1.113-3.076 2.095-.328.655-.197 1.31.261 1.767.197.197.459.328.786.328 1.244-.066 3.338-2.03 4.32-2.946Zm-4.516 2.028c-.197-.196-.262-.458-.066-.85.262-.72 1.31-1.572 2.291-1.572.655 0 1.047.066 1.31.131-1.179 1.113-2.684 2.357-3.405 2.357-.065 0-.13-.066-.13-.066Z"
      />
      <path
        fill="currentColor"
        d="M128.618 8.378c-20.291-.327-36-.523-48.043-.654 1.178-1.571 2.29-3.077 3.338-4.451.13-.197.13-.458-.066-.59-.196-.13-.458-.13-.589.066-.72.916-2.094 2.684-3.73 4.975-29.782-.328-36.982-.197-37.048-.197-.262 0-.393.197-.393.458 0 .197.197.393.393.393.131 0 7.2-.13 36.458.197-4.909 6.807-11.52 16.887-9.425 19.178.523.523 1.57.785 2.945.785 6.48 0 20.553-5.236 22.451-5.89.197-.132.328-.328.262-.59-.13-.196-.327-.327-.589-.196-8.77 3.273-22.516 7.462-24.48 5.302-1.505-1.637 4.254-10.866 9.884-18.59 12.109.131 28.014.328 48.632.655.197 0 .393-.196.393-.458a.422.422 0 0 0-.393-.393Z"
      />
      <path
        fill="currentColor"
        d="M152.652 8.378c-20.29-.327-36-.523-48.043-.654 1.178-1.571 2.291-3.077 3.338-4.451.131-.197.131-.458-.065-.59-.197-.13-.459-.13-.59.066-.72.916-2.094 2.684-3.73 4.975-29.782-.328-36.982-.197-37.048-.197-.262 0-.392.197-.392.458 0 .197.196.393.392.393.131 0 7.2-.13 36.458.197-4.909 6.807-11.52 16.887-9.425 19.178.524.523 1.57.785 2.945.785 6.48 0 20.553-5.236 22.451-5.89.197-.132.328-.328.262-.59-.131-.196-.327-.327-.589-.196-8.771 3.273-22.516 7.462-24.48 5.302-1.505-1.637 4.255-10.866 9.884-18.59 12.109.131 28.014.328 48.632.655.197 0 .393-.196.393-.458a.422.422 0 0 0-.393-.393Z"
      />
    </svg>
  )
}
