import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import z from 'zod'
import {BaseLessonResourceSchema} from '../video/base-lesson-resource'

export const ExerciseSchema = z
  .object({
    _id: z.string().optional(),
    _key: z.string().optional(),
    stackblitz: z.nullable(z.string()).optional(),
    videoResourceId: z.nullable(z.string()).optional(),
    transcript: z.nullable(z.any().array()).optional(),
    solution: z.nullable(
      z
        .object({
          _key: z.string(),
          stackblitz: z.nullable(z.string()).optional(),
          videoResourceId: z.nullable(z.string()).optional(),
          transcript: z.nullable(z.any().array()).optional(),
        })
        .merge(BaseLessonResourceSchema)
        .optional(),
    ),
  })
  .merge(BaseLessonResourceSchema)

export type Exercise = z.infer<typeof ExerciseSchema>

export const getExerciseMuxPlaybackId = async (exerciseSlug: string) => {
  const exerciseVideo = await sanityClient.fetch(
    `
  *[_type == "exercise" && slug.current == $slug][0]
    .resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId`,
    {slug: `${exerciseSlug}`},
  )

  return z.string().nullish().parse(exerciseVideo)
}

export const getExerciseMedia = async (exerciseSlug: string) => {
  const exerciseMedia = await sanityClient.fetch(
    groq`*[_type in ['exercise', 'explainer'] && slug.current == $slug][0]{
      "slug": slug.current,
      body,
      "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
      "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
      "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
      "solution": resources[@._type == 'solution'][0]{
        body,
        "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "slug": slug.current,
      }
    }`,
    {slug: `${exerciseSlug}`},
  )

  return exerciseMedia
}

export const getExercise = async (
  slug: string,
  includeMedia: boolean = true,
): Promise<Exercise> => {
  const exercise = await sanityClient.fetch(
    `*[_type in ['exercise', 'explainer'] && slug.current == $slug][0]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      "slug": slug.current,
      body,
      "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
      "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
      "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
      "solution": resources[@._type == 'solution'][0]{
        _key,
        _type,
        "_updatedAt": ^._updatedAt,
        title,
        description,
        body,
        "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
        "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
        "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "slug": slug.current,
      }
    }`,
    {slug},
  )

  return ExerciseSchema.parse(exercise)
}

export const getAllExercises = async (): Promise<Exercise[]> => {
  const exercises =
    await sanityClient.fetch(groq`*[_type in ['exercise', 'explainer']]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      body,
      "slug": slug.current,
      "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
      "videoResourceId": resources[@->._type == 'videoResource'][0],
      "solution": resources[@._type == 'solution'][0]{
        _key,
        _type,
        _updatedAt,
        title,
        description,
        body,
        "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
        "videoResourceId": resources[@->._type == 'videoResource'][0],
       "slug": slug.current
       }
    }`)

  return z.array(ExerciseSchema).parse(exercises)
}
