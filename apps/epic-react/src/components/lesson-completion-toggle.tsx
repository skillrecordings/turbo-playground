import React from 'react'
import {motion} from 'framer-motion'
import {useReward} from 'react-rewards'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useRouter} from 'next/router'
import {trpcSkillLessons} from '@skillrecordings/skill-lesson/utils/trpc-skill-lessons'
import toast from 'react-hot-toast'

const LessonCompleteToggle = () => {
  const {module, lesson} = useLesson()
  const flattenedLessons = module.sections?.flatMap(
    (section) => section.lessons,
  )
  const currentLessonIndex =
    flattenedLessons?.findIndex((l) => l?.slug === lesson.slug) ?? 0
  const router = useRouter()
  const {reward} = useReward('rewardId', 'confetti')
  const lessonSlug = router.query.lesson
  const {
    data: moduleProgress,
    status: moduleProgressStatus,
    isFetching,
  } = trpcSkillLessons.moduleProgress.bySlug.useQuery({
    slug: module.slug.current,
  })
  const moduleCompleted = moduleProgress?.moduleCompleted

  const toggleProgressMutation = trpcSkillLessons.progress.toggle.useMutation()
  const completedLessons = moduleProgress?.lessons.filter(
    (l: any) => l.lessonCompleted,
  )

  // cannot use id because lesson from useLesson returns solution resource when on solution page
  const isLessonCompleted = Boolean(
    completedLessons?.find(({id, slug}: any) => slug === lessonSlug),
  )

  const [optimisticallyToggled, setOptimisticallyToggled] = React.useState(
    isLessonCompleted || false,
  )

  React.useEffect(() => {
    moduleProgressStatus === 'success' &&
      setOptimisticallyToggled(isLessonCompleted)
  }, [moduleProgressStatus, isLessonCompleted])

  const handleToggleLessonProgress = async () => {
    setOptimisticallyToggled(!optimisticallyToggled)

    return await toggleProgressMutation.mutateAsync(
      {
        lessonSlug: lessonSlug as string,
      },
      {
        onSuccess: (data) => {
          console.log({data})
          if (
            'completedAt' in data &&
            data?.completedAt &&
            flattenedLessons &&
            flattenedLessons[currentLessonIndex + 1]
          ) {
            reward()
            router.push(
              `/modules/${module.slug.current}/${
                flattenedLessons[currentLessonIndex + 1]?.slug
              }`,
            )
          } else if (moduleCompleted) {
            router.push(`/modules/${module.slug.current}/completed`)
          } else if ((data && !('completedAt' in data)) || !data?.completedAt) {
          } else {
            reward()
            toast.success(
              "You have more lessons in this module before it's fully completed",
              {
                duration: 5000,
              },
            )
          }
        },
        onError: (error: any) => {
          setOptimisticallyToggled((value) => !value)
          toast.error(`Error setting lesson progress.`)
          console.debug(error.message)
        },
      },
    )
  }

  return (
    <div>
      <div className="flex items-center">
        <motion.button
          type="button"
          className={`relative flex h-[46px] cursor-pointer items-center justify-center overflow-hidden rounded-lg leading-7 transition-colors duration-200 ease-in-out ${
            isLessonCompleted
              ? 'bg-emerald-600 px-3 py-2 hover:bg-emerald-700 '
              : 'bg-emerald-600 px-5 py-2 hover:bg-emerald-600'
          }`}
          animate={{
            width: isLessonCompleted ? 46 : '100%',
            borderRadius: isLessonCompleted ? 23 : 8,
          }}
          initial={false}
          id="rewardId"
          onClick={handleToggleLessonProgress}
        >
          <div className="flex w-full cursor-pointer items-center justify-center text-sm font-semibold text-white">
            {isLessonCompleted && (
              <motion.svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inline-block"
                animate={{
                  y: isLessonCompleted ? 0 : 60,
                }}
                initial={false}
              >
                <g fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </motion.svg>
            )}
            <motion.div
              className="whitespace-no-wrap flex shrink-0 cursor-pointer items-center justify-center"
              animate={{
                y: isLessonCompleted ? -70 : 0,
                opacity: isLessonCompleted ? 0 : 1,
              }}
              initial={false}
            >
              Complete and Continue
              {/* prettier-ignore */}
              <svg className="ml-2" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
            </motion.div>
          </div>
        </motion.button>
      </div>
    </div>
  )
}

export default LessonCompleteToggle
