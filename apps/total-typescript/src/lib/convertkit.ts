import z, {record} from 'zod'
import {
  formatDate,
  setConvertkitSubscriberFields,
} from '@skillrecordings/convertkit-sdk'

export const SubscriberSchema = z.object({
  id: z.number(),
  first_name: z.string().nullish(),
  email_address: z.string(),
  state: z.string(),
  fields: record(z.string().nullable()).default({}),
  created_at: z.string().optional(),
})

export type Subscriber = z.infer<typeof SubscriberSchema>

export const transformSlugsToConvertkitField = ({
  moduleSlug,
  lessonSlug,
  action,
  separator = '_',
}: {
  moduleSlug: string
  lessonSlug: string
  action: string
  separator?: string
}) => {
  const transformedModuleSlug = moduleSlug.replace('-', separator)
  const transformedLessonSlug = lessonSlug.replace('-', separator)
  return (
    transformedModuleSlug +
    separator +
    transformedLessonSlug +
    separator +
    action
  )
}

/**
 * updates a custom field on convertkit with the current date/time
 * when a learner completes a lesson (exercise/tip/etc)
 *
 * @param subscriber
 * @param moduleSlug
 * @param lessonSlug
 */
export const markLessonComplete = async ({
  subscriber,
  moduleSlug,
  lessonSlug,
}: {
  subscriber: Subscriber
  moduleSlug: string
  lessonSlug: string
}) => {
  try {
    const fieldName = transformSlugsToConvertkitField({
      moduleSlug,
      lessonSlug,
      action: 'completed_on',
    })
    const response = await setConvertkitSubscriberFields(subscriber, {
      [fieldName]: formatDate(new Date()),
    })

    return await response.json()
  } catch (error) {
    return {error}
  }
}

/**
 * updates a custom field on convertkit with the current date/time
 * when a learner completes a lesson (exercise/tip/etc)
 *
 * @param subscriber
 * @param moduleSlug
 * @param lessonSlug
 */
export const answerSurvey = async ({
  subscriber,
  question,
  answer,
}: {
  subscriber: Subscriber
  question: string
  answer: string
}) => {
  try {
    const response = await setConvertkitSubscriberFields(
      {
        id: subscriber.id,
        fields: subscriber.fields,
      },
      {
        [question]: answer,
        last_surveyed_on: formatDate(new Date()),
      },
    )

    return await response.json()
  } catch (error) {
    return {error}
  }
}
