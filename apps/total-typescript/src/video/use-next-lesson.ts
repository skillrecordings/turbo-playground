import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'

import {type LessonResource} from './lesson-resources'

import {trpc} from 'video/trpc'

export const useNextLesson = (
  lesson: LessonResource,
  module: SanityDocument,
  section?: SanityDocument,
) => {
  const router = useRouter()
  const {data: nextExercise} = trpc.lessons.getNextLesson.useQuery({
    type: lesson._type,
    slug: router.query.exercise as string,
    module: module.slug.current,
    section: section?.slug,
  })
  return nextExercise
}
