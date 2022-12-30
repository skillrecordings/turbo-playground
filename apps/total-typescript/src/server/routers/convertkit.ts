import {z} from 'zod'
import {answerSurvey, markLessonComplete} from 'lib/convertkit'
import {updateSubscriber} from '@skillrecordings/convertkit-sdk'
import {serialize} from 'cookie'
import {SubscriberSchema} from '@skillrecordings/skill-lesson/schemas/subscriber'
import {convertkitSetSubscriberCookie} from '@skillrecordings/skill-lesson/utils/ck-set-subscriber-cookie'
import {publicProcedure, router} from '../trpc'

export const convertkitRouter = router({
  updateName: publicProcedure
    .input(
      z.object({
        first_name: z.string().optional(),
        last_name: z.string().optional(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const subscriberCookie = ctx.req.cookies['ck_subscriber']
      const {first_name, last_name} = input

      if (!subscriberCookie) {
        console.debug('no subscriber cookie')
        return {error: 'no subscriber found'}
      }

      const subscriber = SubscriberSchema.parse(JSON.parse(subscriberCookie))

      if (!subscriber) {
        console.debug('no subscriber cookie')
        return {error: 'no subscriber found'}
      }

      const updatedSubscriber = await updateSubscriber({
        id: subscriber.id,
        first_name,
        fields: {...(last_name && {last_name})},
      })

      convertkitSetSubscriberCookie({
        subscriber: updatedSubscriber.subscriber,
        res: ctx.res,
      })

      return updatedSubscriber
    }),
  completeLesson: publicProcedure
    .input(
      z.object({
        moduleSlug: z.string(),
        lessonSlug: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const subscriberCookie = ctx.req.cookies['ck_subscriber']

      if (!subscriberCookie) {
        console.debug('no subscriber cookie')
        return {error: 'no subscriber found'}
      }

      const subscriber = SubscriberSchema.parse(JSON.parse(subscriberCookie))

      if (!subscriber) {
        return {error: 'no subscriber found'}
      }

      const updatedSubscriber = await markLessonComplete({
        subscriber,
        ...input,
      })

      const convertkitCookie = serialize(
        `ck_subscriber`,
        JSON.stringify(updatedSubscriber.subscriber),
        {
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 31556952,
        },
      )

      ctx.res.setHeader('Set-Cookie', convertkitCookie)

      return updatedSubscriber
    }),
  answerSurvey: publicProcedure
    .input(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const subscriberCookie = ctx.req.cookies['ck_subscriber']

      if (!subscriberCookie) {
        console.debug('no subscriber cookie')
        return {error: 'no subscriber found'}
      }

      const subscriber = SubscriberSchema.parse(JSON.parse(subscriberCookie))

      if (!subscriber) {
        return {error: 'no subscriber found'}
      }

      const updatedSubscriber = await answerSurvey({
        subscriber,
        ...input,
      })

      const convertkitCookie = serialize(
        `ck_subscriber`,
        JSON.stringify(updatedSubscriber.subscriber),
        {
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 31556952,
        },
      )

      ctx.res.setHeader('Set-Cookie', convertkitCookie)

      return updatedSubscriber
    }),
})
