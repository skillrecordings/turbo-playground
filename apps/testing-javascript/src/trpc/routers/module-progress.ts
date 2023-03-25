import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {prisma} from '@skillrecordings/database'
import {getToken} from 'next-auth/jwt'
import {ModuleProgressSchema} from 'utils/module-progress'
import {getModule} from '@skillrecordings/skill-lesson/lib/modules'

export const moduleProgressRouter = router({
  bySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().nullish(),
      }),
    )
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token || !input.slug) {
        return null
      }

      const module = await getModule(input.slug)

      const allModuleLessons = module.lessons

      const lessonIds = allModuleLessons.map((lesson: Lesson) => lesson._id)

      const moduleLessonProgress = await prisma.lessonProgress.findMany({
        where: {
          lessonId: {in: lessonIds},
          userId: token.id as string,
        },
      })

      const moduleProgressLessons = allModuleLessons.map((lesson: Lesson) => {
        return {
          id: lesson._id,
          slug: lesson.slug,
          lessonCompleted: Boolean(
            moduleLessonProgress.find(
              (progress) => progress.lessonId === lesson._id,
            ),
          ),
        }
      })

      return ModuleProgressSchema.parse({
        moduleId: module._id,
        nextLesson:
          moduleProgressLessons.find(
            (lesson: {lessonCompleted: boolean}) => !lesson.lessonCompleted,
          ) || null,
        moduleCompleted: moduleProgressLessons.every(
          (lesson: {lessonCompleted: boolean}) => lesson.lessonCompleted,
        ),
        percentComplete: Math.round(
          (moduleLessonProgress.length / allModuleLessons.length) * 100,
        ),
        completedLessonCount: moduleLessonProgress.length,
        lessonCount: allModuleLessons.length,
        lessons: moduleProgressLessons,
      })
    }),
})
