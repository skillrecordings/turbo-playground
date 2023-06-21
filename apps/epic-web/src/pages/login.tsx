import * as React from 'react'
import {getCsrfToken, getProviders, signIn} from 'next-auth/react'
import {useForm} from 'react-hook-form'
import {GetServerSideProps} from 'next'
import Image from 'next/image'
import Layout from 'components/app/layout'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import Balancer from 'react-wrap-balancer'
import {Button, Input, Label} from '@skillrecordings/skill-lesson/ui'
import {Logo} from 'components/app/navigation'

const Login: React.FC<
  React.PropsWithChildren<{csrfToken: string; providers: any}>
> = ({csrfToken, providers = {}}) => {
  const {
    register,
    formState: {errors},
  } = useForm()

  const router = useRouter()

  const {query} = router

  React.useEffect(() => {
    const {query} = router
    if (query.message) {
      toast(query.message as string, {
        icon: '⛔️',
      })
    }
    if (query.error) {
      switch (query.error) {
        case 'OAuthAccountNotLinked':
          toast(
            'Github account NOT connected. Is it already linked? Try logging out and logging in with Github to check.',
            {
              icon: '⛔️',
            },
          )
          break
      }
    }
  }, [router])

  const githubProvider = providers.github

  return (
    <Layout meta={{title: 'Log in to Epic Web'}}>
      <div className="relative mx-auto flex w-full flex-grow flex-col items-center justify-start pb-16 pt-24 sm:p-5 sm:pt-32">
        <main>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto w-16"
            fill="none"
            viewBox="0 0 70 70"
          >
            <path
              fill="url(#markGradient)"
              d="M36.277 33.738a64.504 64.504 0 0 1-4.257 2.15c-6.333 2.912-15.383 5.86-26.228 5.981l-1.249.014-.226-1.228a31.016 31.016 0 0 1-.531-5.638C3.786 17.804 17.787 3.802 35 3.802a31.05 31.05 0 0 1 13.295 2.975l4.146-2.113A34.774 34.774 0 0 0 35 0C15.712 0 0 15.712 0 35c0 7.7 2.504 14.83 6.74 20.617 7.252-1.235 11.802-4.14 11.802-4.14s-2.905 4.544-4.14 11.798A34.803 34.803 0 0 0 35 70c19.288 0 35-15.712 35-35a34.778 34.778 0 0 0-4.652-17.42l-2.11 4.138a31.037 31.037 0 0 1 2.976 13.299C66.214 52.23 52.213 66.23 35 66.23c-1.942 0-3.804-.196-5.635-.53l-1.231-.225.014-1.251c.12-10.854 3.069-19.903 5.98-26.234a64.386 64.386 0 0 1 2.149-4.253Z"
            ></path>
            <path
              fill="#FFF"
              d="m53.235 27.155-8.03-2.344-2.345-8.047L69.5.5 53.235 27.155Z"
            ></path>
            <defs>
              <linearGradient
                id="markGradient"
                x1="49.496"
                x2="20.585"
                y1="20.504"
                y2="49.431"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#4F75FF"></stop>
                <stop offset="1" stop-color="#30AFFF"></stop>
              </linearGradient>
            </defs>
          </svg>
          <h1 className="font-text pt-3 text-center text-4xl font-extrabold leading-9 sm:pt-8 sm:text-4xl">
            Log in to Epic Web
          </h1>
          {query?.error === 'Verification' ? (
            <p className="max-w-sm pt-4 text-center sm:mx-auto sm:w-full sm:pt-8">
              <Balancer>
                That sign in link is no longer valid. It may have been used
                already or it may have expired. Please request a new log in link
                below.{' '}
                <a
                  className="inline-flex items-center space-x-1 text-cyan-300 hover:underline"
                  href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
                >
                  Click here to email us
                </a>{' '}
                if you need help.
              </Balancer>
            </p>
          ) : null}
          <div className="pt-8 sm:mx-auto sm:w-full sm:max-w-md sm:pt-10 sm:text-lg">
            <form method="post" action="/api/auth/signin/email">
              <Label htmlFor="email">Email address</Label>
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <Input
                  id="email"
                  type="email"
                  required={true}
                  placeholder="you@example.com"
                  className="pl-10"
                  {...register('email', {required: true})}
                />
              </div>
              <Button className="mt-4 w-full transition hover:saturate-200">
                Email me a login link
              </Button>
            </form>
          </div>
          {githubProvider ? (
            <div className="flex flex-col items-center sm:text-lg">
              <span className="py-5 text-sm opacity-60">or</span>
              <Button
                className="w-full"
                variant="outline"
                onClick={() =>
                  signIn(githubProvider.id, {
                    callbackUrl: '/',
                  })
                }
              >
                <span className="mr-2 flex items-center justify-center">
                  <Icon name="Github" size="20" />
                </span>
                Log in with {githubProvider.name}
              </Button>
            </div>
          ) : null}
        </main>
      </div>
    </Layout>
  )
}

export default Login

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders()
  const csrfToken = await getCsrfToken(context)

  return {
    props: {
      providers,
      csrfToken,
    },
  }
}
