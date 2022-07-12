import * as React from 'react'
import {getCsrfToken, getProviders} from 'next-auth/react'
import {useForm} from 'react-hook-form'
import {GetServerSideProps} from 'next'

const Login: React.FC<{csrfToken: string}> = ({csrfToken}) => {
  const {
    register,
    formState: {errors},
  } = useForm()

  return (
    <div>
      <div className="flex flex-col items-center justify-center flex-grow w-full p-5 pt-0 pb-16 mx-auto text-gray-900 dark:text-white md:pb-40 md:pt-16">
        <main className="rounded-lg sm:mx-auto">
          <div className="flex items-center justify-center w-full max-w-sm mx-auto"></div>
          <h1 className="pt-4 text-3xl font-bold leading-9 text-center font-heading">
            Log in to Escuela Frontend
          </h1>

          <div className="mt-4 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div>
              <form className="" method="post" action="/api/auth/signin/email">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold leading-5"
                >
                  Email address
                </label>
                <input
                  name="csrfToken"
                  type="hidden"
                  defaultValue={csrfToken}
                />
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-white/50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    required={true}
                    placeholder="you@example.com"
                    className="block w-full py-3 pl-10 mb-3 text-white border border-white rounded-md focus:ring-gray-500 focus:border-gray-500 placeholder-white/50 border-opacity-20 bg-gray-800/50"
                    {...register('email', {required: true})}
                  />
                </div>

                {errors.email && <p>{errors.email.message}</p>}

                <button className="flex items-center justify-center w-full px-5 py-4 pt-2 mt-5 text-lg font-semibold text-white transition bg-blue-500 border border-transparent rounded-md font-nav hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-yellow-200">
                  Email me a login link
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
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
