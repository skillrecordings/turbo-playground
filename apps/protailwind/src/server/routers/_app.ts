/**
 * This file contains the root router of your tRPC-backend
 */
import {progressRouter} from './progress'
import {convertkitRouter} from './convertkit'
import {router} from '../trpc'
import {sandpackResourceRouter} from './sandpack-resource'

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = router({
  progress: progressRouter,
  convertkit: convertkitRouter,
  sandpack: sandpackResourceRouter,
})

export type AppRouter = typeof appRouter
