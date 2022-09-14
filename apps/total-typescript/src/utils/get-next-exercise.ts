import {SanityDocument} from '@sanity/client'
import {Exercise} from 'lib/exercises'
import find from 'lodash/find'
import indexOf from 'lodash/indexOf'

export const getNextExercise = (
  module: SanityDocument,
  currentExercise: Exercise,
) => {
  if (currentExercise._type === 'exercise') {
    return currentExercise.resources.find(
      (resource: SanityDocument) => resource._type === 'solution',
    )
  }

  const exerciseForSolution = module.exercises.find(
    (resource: SanityDocument) => {
      const solution = resource.resources.find(
        (resource: SanityDocument) => resource._key === currentExercise._key,
      )
      return solution?._key === currentExercise._key
    },
  )

  const current = find(module.exercises, {_id: exerciseForSolution._id})
  const nextExerciseIndex = indexOf(module.exercises, current) + 1
  const nextExercise = module.exercises[nextExerciseIndex]
  return nextExercise
}
