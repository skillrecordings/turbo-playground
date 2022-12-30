import React from 'react'
import ExerciseTemplate from 'templates/exercise-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getAllTutorials, getTutorial} from 'lib/tutorials'
import {Exercise, getExercise} from 'lib/exercises'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const exerciseSlug = params?.exercise as string

  const module = await getTutorial(params?.module as string)
  const exercise = await getExercise(exerciseSlug)

  return {
    props: {
      exercise,
      module,
      ...(exercise.solution?.transcript && {
        transcript: exercise.solution?.transcript,
      }),
      videoResourceId: exercise.solution?.videoResourceId,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const tutorials = await getAllTutorials()

  const paths = tutorials.reduce((acc: any[], tutorial: any) => {
    return [
      ...acc,
      ...tutorial.exercises
        .filter((exercise: Exercise) => Boolean(exercise.solution))
        .map((exercise: Exercise) => {
          return {
            params: {
              module: tutorial.slug.current,
              exercise: exercise.slug,
            },
          }
        }),
    ]
  }, [])
  return {paths, fallback: 'blocking'}
}

const ExerciseSolution: React.FC<any> = ({
  exercise,
  module,
  transcript,
  videoResourceId,
}) => {
  return (
    <LessonProvider lesson={exercise} module={module}>
      <VideoResourceProvider videoResourceId={videoResourceId}>
        <ExerciseTemplate transcript={transcript} />
      </VideoResourceProvider>
    </LessonProvider>
  )
}

export default ExerciseSolution
