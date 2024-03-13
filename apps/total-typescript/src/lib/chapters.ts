import z from 'zod'
import {sanityQuery} from '@/server/sanity.server'
import groq from 'groq'
import type {MDXRemoteSerializeResult} from 'next-mdx-remote'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {findIndex} from 'lodash'

export const ChapterResourceSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.object({
    current: z.string(),
  }),
  body: z.string().optional(),
  mdx: z.unknown() as z.Schema<MDXRemoteSerializeResult>,
  video: z
    .object({
      videoResourceId: z.string(),
    })
    .nullable()
    .optional(),
  solution: z
    .object({
      body: z.string().optional(),
      mdx: z.unknown() as z.Schema<MDXRemoteSerializeResult>,
      videoResourceId: z.string(),
      code: z
        .object({
          openFile: z.string().optional().nullable(),
        })
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
  code: z
    .object({
      openFile: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
})

export const ChapterSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.object({
    current: z.string(),
  }),
  moduleType: z.literal('chapter'),
  github: z
    .object({
      _type: z.literal('github'),
      repo: z.string(),
      title: z.string(),
    })
    .optional()
    .nullable(),
  resources: z.array(ChapterResourceSchema).optional().nullable(),
})

export type Chapter = z.infer<typeof ChapterSchema>
export type ChapterResource = z.infer<typeof ChapterResourceSchema>

export async function getChapter(
  slugOrId: string,
  withResources: boolean = true,
) {
  const chapter = await sanityQuery<Chapter | Omit<Chapter, 'resources'>>(
    groq`*[_type == 'module' && moduleType == 'chapter' && (slug.current == "${slugOrId}" || _id == "${slugOrId}")][0]{
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        slug,
        moduleType,
        github,
        ${
          withResources
            ? `'resources': resources[]->{${chapterResourceQuery}},`
            : ''
        }
    }`,
    {tags: ['chapter', slugOrId]},
  )

  if (withResources) {
    const parsed = ChapterSchema.safeParse(chapter)

    if (!parsed.success) {
      console.error('Error parsing chapter with resources', slugOrId)
      console.error(parsed.error)
      return null
    } else {
      const serializedChapterResources =
        parsed.data.resources &&
        (await serializeBodyToMdx(parsed.data.resources))
      const data = {...parsed.data, resources: serializedChapterResources}

      return data
    }
  } else {
    const parsed = ChapterSchema.omit({resources: true}).safeParse(chapter)

    if (!parsed.success) {
      console.error('Error parsing chapter', slugOrId)
      console.error(parsed.error)
      return null
    } else {
      return parsed.data
    }
  }
}

export const chapterResourceQuery = `
  _id,
  _type,
  _updatedAt,
  _createdAt,
  title,
  slug,
  body,
  'video': resources[@->._type == 'videoResource'][0]->{
    "videoResourceId": _id,
  },
  'code': resources[@._type == 'stackblitz'][0]{
    openFile
  },
  'solution': resources[@._type == 'solution'][0]{
    body,
    'videoResourceId': resources[@->._type == 'videoResource'][0]->_id,
    "code": resources[@._type == 'stackblitz'][0]{
      openFile
    }
  },
`

export async function getChapterResource(slugOrId: string) {
  const chapterResource = await sanityQuery<ChapterResource>(
    groq`*[_type in ['exercise', 'lesson', 'explainer', 'solution'] && (slug.current == "${slugOrId}" || _id == "${slugOrId}")][0]{
        ${chapterResourceQuery}
      }`,
    {tags: ['resource', slugOrId]},
  )

  const parsed = ChapterResourceSchema.safeParse(chapterResource)

  if (!parsed.success) {
    console.error('Error parsing chapter resource', slugOrId)
    console.error(parsed.error)
    return null
  } else {
    const serializedChapterResource = await serializeBodyToMdx([parsed.data])
    return serializedChapterResource[0]
  }
}

const serializeBodyToMdx = async (chapterResources: ChapterResource[]) => {
  const promises = chapterResources.map(async (resource) => {
    let solution = resource.solution
    if (solution && solution.body) {
      const mdx = await serializeMDX(solution.body as string, {
        // useShikiTwoslash: true,
        syntaxHighlighterOptions: {
          theme: 'github-light',
          // authorization: process.env.SHIKI_AUTH_TOKEN,
          // endpoint: process.env.SHIKI_ENDPOINT,
        },
      })
      solution = {...solution, mdx}
    }

    if (resource.body) {
      const mdx = await serializeMDX(resource.body as string, {
        // useShikiTwoslash: true,
        syntaxHighlighterOptions: {
          theme: 'github-light',
          // authorization: process.env.SHIKI_AUTH_TOKEN,
          // endpoint: process.env.SHIKI_ENDPOINT,
        },
      })
      return {...resource, mdx, solution}
    }
    return {...resource, solution}
  })
  return Promise.all(promises)
}

export async function getChapterPositions(chapter: Chapter | null) {
  if (!chapter) return {}

  const allChapters = await sanityQuery<{
    chapters: {
      _id: string
      slug: string
      title: string
      resources: {
        _id: string
        slug: string
        title: string
      }[]
    }[]
  }>(
    groq`*[_type == 'module' && moduleType == 'book'][0]{
    'chapters': resources[]->{
      _id,
      "slug": slug.current,
      title,
      "resources": resources[]->{
        _id,
        "slug": slug.current,
        title,
      }
    }
    
  }`,
    {tags: ['chapters']},
  )

  const chapters = allChapters.chapters

  const currentChapterIndex = findIndex(chapters, {
    _id: chapter._id,
    slug: chapter.slug.current,
    title: chapter.title,
  })

  const nextChapter =
    findIndex(chapters, chapters[currentChapterIndex + 1]) !== -1
      ? chapters[currentChapterIndex + 1]
      : null

  const prevChapter =
    findIndex(chapters, chapters[currentChapterIndex - 1]) !== -1
      ? chapters[currentChapterIndex - 1]
      : null

  return {
    nextChapter: nextChapter as Chapter | null,
    currentChapterIndex: currentChapterIndex + 1,
    prevChapter,
    chapters,
  }
}

export async function getResourcePositions(
  chapter: Chapter | null,
  currentResource: ChapterResource,
) {
  if (!chapter || !currentResource || !chapter.resources) return {}

  const currentResourceIndex = findIndex(chapter.resources, currentResource)

  const nextResource =
    findIndex(
      chapter.resources,
      chapter.resources[currentResourceIndex + 1],
    ) !== -1
      ? chapter.resources[currentResourceIndex + 1]
      : null

  const prevResource =
    findIndex(
      chapter.resources,
      chapter.resources[currentResourceIndex - 1],
    ) !== -1
      ? chapter.resources[currentResourceIndex - 1]
      : null

  return {
    currentResourceIndex: currentResourceIndex + 1,
    nextResource,
    prevResource,
  }
}
