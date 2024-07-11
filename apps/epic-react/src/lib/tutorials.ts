import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {z} from 'zod'
import {ContributorSchema} from './contributors'
import {ModuleSchema} from '@skillrecordings/skill-lesson/schemas/module'
import {ProductSchema} from './products'

const TutorialSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string().optional(),
  _createdAt: z.string().optional(),
  title: z.string(),
  slug: z.object({
    current: z.string(),
  }),
  description: z.nullable(z.string()).optional(),
  body: z.string().optional().nullable(),
  moduleType: z.enum(['tutorial', 'bonus']),
  state: z.enum(['draft', 'published']),
  image: z.nullable(z.string()).optional(),
  ogImage: z.nullable(z.string()).optional(),
  workshopApp: z
    .nullable(
      z.object({
        path: z.string().nullable(),
        localhost: z.object({
          path: z.string(),
        }),
        external: z.object({
          url: z.string(),
        }),
      }),
    )
    .optional(),
  github: z
    .nullable(
      z.object({
        repo: z.string(),
        title: z.string().nullable(),
      }),
    )
    .optional(),
  instructor: ContributorSchema.optional().nullable(),
  product: z.array(ProductSchema).optional().nullable(),
  lessons: z.array(z.any()).optional().nullable(),
  sections: z
    .array(
      z.object({
        _id: z.string(),
        _type: z.string(),
        _updatedAt: z.string().optional(),
        title: z.string(),
        description: z.string().optional().nullable(),
        slug: z.string(),
        lessons: z.array(
          z.object({
            _id: z.string(),
            _type: z.string(),
            _updatedAt: z.string().optional(),
            title: z.string(),
            description: z.string().optional().nullable(),
            slug: z.string(),
            solution: z
              .nullable(
                z.object({
                  _key: z.string(),
                  _type: z.string(),
                  _updatedAt: z.string().optional(),
                  title: z.string(),
                  description: z.string().optional().nullable(),
                  slug: z.string(),
                }),
              )
              .optional(),
          }),
        ),
        resources: z.any(),
      }),
    )
    .optional()
    .nullable(),
})
export const TutorialsSchema = z.array(TutorialSchema)
export type Tutorial = z.infer<typeof TutorialSchema>

// const tutorialsQuery = groq`*[_type == "module" && moduleType == 'tutorial' && state == 'published'] | order(_createdAt asc) {
const tutorialsQuery = groq`*[_type == "module" && moduleType == 'tutorial'] | order(_createdAt desc) {
  _id,
  _type,
  title,
  slug,
  moduleType,
  "image": image.asset->url,
  _updatedAt,
  _createdAt,
  description,
  state,
  github,
  "instructor": contributors[@.role == 'instructor'][0].contributor->{
      _id,
      _type,
      _updatedAt,
      _createdAt,
      name,
      bio,
      links[] {
        url, label
      },
      picture {
          "url": asset->url,
          alt
      },
      "slug": slug.current,
    },
  'product': *[_type=='product' && references(^._id)][]{
    _id,
    _type,
    _updatedAt,
    _createdAt,
    productId,
    title,
    description,
    type,
    image,
    state,
    type,
    "slug": slug.current,
    body,
    "welcomeVideo": welcomeVideo->{"muxPlaybackId":muxAsset.muxPlaybackId, poster},
    upgradableTo[]->{
      ...,
      modules[]->{
        ...,
        "description": "",
        "image": image.asset->{url},
      }  
    },
    modules[]->{
      ...,
      "image": image.asset->{url},
    }
  },
  "sections": resources[@->._type == 'section']->{
    _id,
    _type,
    _updatedAt,
    title,
    description,
    "slug": slug.current,
    "lessons": resources[@->._type in ['exercise', 'explainer']]->{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      "slug": slug.current,
      "solution": resources[@._type == 'solution'][0]{
        _key,
        _type,
        "_updatedAt": ^._updatedAt,
        title,
        description,
        "slug": slug.current,
      }
    },
    "resources": resources[@->._type in ['linkResource']]->
  }
}`

// const fullStackVol1WorkshopsQuery = groq`*[_type == "product" && slug.current == 'full-stack-vol-1'][0] {
//   modules[]->{
//     _id,
//     _type,
//     title,
//     slug,
//     moduleType,
//     "image": image.asset->url,
//     _updatedAt,
//     _createdAt,
//     description,
//     state,
//     "instructor": contributors[@.role == 'instructor'][0].contributor->{
//         _id,
//         _type,
//         _updatedAt,
//         _createdAt,
//         name,
//         bio,
//         links[] {
//           url, label
//         },
//         picture {
//             "url": asset->url,
//             alt
//         },
//         "slug": slug.current,
//       },
//     'product': *[_type=='product' && references(^._id)][]{
//       _id,
//       _type,
//       _updatedAt,
//       _createdAt,
//       productId,
//       title,
//       description,
//       type,
//       image,
//       state,
//       type,
//       "slug": slug.current,
//       body,
//       "welcomeVideo": welcomeVideo->{"muxPlaybackId":muxAsset.muxPlaybackId, poster},
//       upgradableTo[]->{
//         ...,
//         modules[]->{
//           ...,
//           "description": "",
//           "image": image.asset->{url},
//         }
//       },
//       modules[]->{
//         ...,
//         "image": image.asset->{url},
//       }
//     },
//     "sections": resources[@->._type == 'section']->{
//       _id,
//       _type,
//       _updatedAt,
//       title,
//       description,
//       "slug": slug.current,
//       "lessons": resources[@->._type in ['exercise', 'explainer']]->{
//         _id,
//         _type,
//         _updatedAt,
//         title,
//         description,
//         "slug": slug.current,
//         "solution": resources[@._type == 'solution'][0]{
//           _key,
//           _type,
//           "_updatedAt": ^._updatedAt,
//           title,
//           description,
//           "slug": slug.current,
//         }
//       },
//       "resources": resources[@->._type in ['linkResource']]->
//     }
//   }
// }`

export const getAllTutorials = async () => {
  const tutorials = await sanityClient.fetch(tutorialsQuery)
  const parsedTutorials = TutorialsSchema.safeParse(tutorials)

  if (!parsedTutorials.success) {
    console.error('Error parsing workshops')
    console.error(parsedTutorials.error)
    return []
  } else {
    return parsedTutorials.data
  }
}

// export const getFullStackVol1Workshops = async () => {
//   const product = await sanityClient.fetch(fullStackVol1WorkshopsQuery)
//   const workshops = product.modules
//   const parsedWorkshops = WorkshopsSchema.safeParse(workshops)

//   if (!parsedWorkshops.success) {
//     console.error('Error parsing workshops')
//     console.error(parsedWorkshops.error)
//     return []
//   } else {
//     return parsedWorkshops.data
//   }
// }

export const getTutorial = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && moduleType == 'tutorial' && slug.current == $slug][0]{
        "id": _id,
        _type,
        title,
        state,
        slug,
        body,
        moduleType,
        _id,
        github,
        workshopApp,
        ogImage,
        description,
        _updatedAt,
        "instructor": contributors[@.role == 'instructor'][0].contributor->{
          _id,
          _type,
          _updatedAt,
          _createdAt,
          name,
          bio,
          links[] {
            url, label
          },
          picture {
              "url": asset->url,
              alt
          },
          "slug": slug.current,
        },
        "testimonials": resources[@->._type == 'testimonial']->{
          _id,
          _type,
          _updatedAt,
          body,
          author {
            name,
            "image": image.asset->url
          }
        },
        "sections": resources[@->._type == 'section']->{
          _id,
          _type,
          _updatedAt,
          title,
          description,
          "slug": slug.current,
          "lessons": resources[@->._type in ['exercise', 'explainer', 'lesson']]->{
            _id,
            _type,
            _updatedAt,
            title,
            description,
            workshopApp,
            "slug": slug.current,
            "solution": resources[@._type == 'solution'][0]{
              _key,
              _type,
              "_updatedAt": ^._updatedAt,
              title,
              description,
              "slug": slug.current,
            }
          },
          "resources": resources[@->._type in ['linkResource']]->
        },
        "image": image.asset->url, 
        // get product that includes current workshop and has
        // the largest number of modules so we can assume it's a bundle
        'product': *[_type == 'product' && references(^._id)] | order(count(modules) asc)[0]{
          "name": title,
          "slug": slug.current,
          productId,
          state,
          description,
          action,
          image,
          unitAmount,
          upgradableTo[0]->{
            ...,
            productId,
            "slug": slug.current,
            modules[]->{moduleType},
          },
          modules[]->{
            "slug": slug.current,
            moduleType,
            title,
            "image": image.asset->{url, alt},
            state,
          },
          features[]{
            value,
            icon
          }
        },
    }`,
    {slug: `${slug}`},
  )

// import groq from 'groq'
// import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

// // const tutorialsQuery = groq`*[_type == "module" && moduleType == 'tutorial' && state == 'published'] | order(_createdAt desc) {
// const tutorialsQuery = groq`*[_type == "module" && moduleType == 'tutorial'] | order(_createdAt desc) {
//   _id,
//   _type,
//   title,
//   slug,
//   moduleType,
//   "image": image.secure_url,
//   _updatedAt,
//   _createdAt,
//   description,
//   state,
//   "sections": resources[@->._type == 'section']->{
//     _id,
//     _type,
//     _updatedAt,
//     title,
//     description,
//     "slug": slug.current,
//     "lessons": resources[@->._type in ['exercise', 'explainer', 'lesson']]->{
//       _id,
//       _type,
//       _updatedAt,
//       title,
//       description,
//       "slug": slug.current,
//       "solution": resources[@._type == 'solution'][0]{
//         _key,
//         _type,
//         "_updatedAt": ^._updatedAt,
//         title,
//         description,
//         "slug": slug.current,
//       }
//     },
//     "resources": resources[@->._type in ['linkResource']]->
//   }
// }`

// export const getAllTutorials = async () =>
//   await sanityClient.fetch(tutorialsQuery)

// export const getTutorial = async (slug: string) =>
//   await sanityClient.fetch(
//     groq`*[_type == "module" && moduleType == 'tutorial' && slug.current == $slug][0]{
//       "id": _id,
//       _type,
//       title,
//       state,
//       slug,
//       moduleType,
//       _id,
//       github,
//       "ogImage": ogImage.secure_url,
//       description,
//       _updatedAt,
//       "image": image.secure_url,
//       body,
//       "testimonials": resources[@->._type == 'testimonial']->{
//         _id,
//         _type,
//         _updatedAt,
//         body,
//         author {
//           name,
//           "image": image.asset->url
//         }
//       },
//       "sections": resources[@->._type == 'section']->{
//         _id,
//         _type,
//         _updatedAt,
//         title,
//         description,
//         "slug": slug.current,
//         "lessons": resources[@->._type in ['exercise', 'explainer', 'lesson']]->{
//           _id,
//           _type,
//           _updatedAt,
//           title,
//           description,
//           "slug": slug.current,
//           "solution": resources[@._type == 'solution'][0]{
//             _key,
//             _type,
//             "_updatedAt": ^._updatedAt,
//             title,
//             description,
//             "slug": slug.current,
//           }
//         },
//         "resources": resources[@->._type in ['linkResource']]->
//       }
//     }`,
//     {slug: `${slug}`},
//   )
