import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {workshop} from './workshop'
import {abilities} from './abilities'
import {solutionsRouter} from './solutions'
import {moduleProgressRouter} from './module-progress'
import {purchasesRouter} from './purchases'
import {userRouter} from './user'
import {productsRouter} from './products'
import {stackblitzResourceRouter} from './stackblitz-resources'

export const appRouter = mergeRouters(
  router({
    workshops: workshop,
    abilities: abilities,
    solutions: solutionsRouter,
    moduleProgress: moduleProgressRouter,
    purchases: purchasesRouter,
    user: userRouter,
    products: productsRouter,
    stackblitz: stackblitzResourceRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
