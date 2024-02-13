import Layout from '@/components/app/layout'
import {getWorkshopsForProduct} from '@/lib/workshops'
import {getAllBonuses} from '@/lib/bonuses'
import {GetServerSideProps} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/app/header'
import {getOgImage} from '@/utils/get-og-image'
import {WorkshopSchema} from '@/lib/workshops'
import React from 'react'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  // TODO: load the user's purchases and figure out what product they should have access to
  const productId = 'kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38'

  const workshops = await getWorkshopsForProduct({productId})

  // TODO: get bonuses based on `productId` level?
  const bonuses = await getAllBonuses()

  return {
    props: {workshops, bonuses},
  }
}

const ResourceLink: React.FC<{
  _id: string
  title: string
  workshopSlug: string
  resourceSlug: string
}> = ({_id, title, workshopSlug, resourceSlug}) => {
  return (
    <Link
      key={_id}
      href={`/workshops/${workshopSlug}/${resourceSlug}`}
      className="block"
    >
      {title}
    </Link>
  )
}

const Learn: React.FC<{workshops: any[]; bonuses: any[]}> = ({
  workshops: unparsedWorkshops,
  bonuses,
}) => {
  const title = 'Learn'

  const workshops = WorkshopSchema.array().parse(unparsedWorkshops)

  return (
    <Layout
      meta={{
        title,
        openGraph: {
          images: [getOgImage({title})],
        },
      }}
    >
      <Header title={title} />
      <main className="mx-auto w-full max-w-screen-lg px-5">
        <h2 className="text-center text-5xl">Learn Page</h2>
        <ul className="space-y-6">
          {workshops.map((workshop) => {
            return (
              <li key={workshop._id} className="flex space-x-6">
                <div className="shrink-0">
                  <Image src={workshop.image} alt="" width={200} height={200} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl">{workshop.title}</h3>
                  <ul>
                    {workshop.resources.map((resource) => {
                      if (resource._type === 'explainer') {
                        return (
                          <ResourceLink
                            _id={resource._id}
                            title={resource.title}
                            workshopSlug={workshop.slug.current}
                            resourceSlug={resource.slug}
                          />
                        )
                      }

                      if (resource._type === 'section') {
                        const sectionResources = resource.resources || []
                        return (
                          <>
                            <h4 className="text-1xl font-bold">
                              Section: {resource.title}
                            </h4>
                            <ul>
                              {sectionResources.map((sectionResource) => {
                                return (
                                  <li>
                                    <ResourceLink
                                      _id={sectionResource._id}
                                      title={sectionResource.title}
                                      workshopSlug={workshop.slug.current}
                                      resourceSlug={sectionResource.slug}
                                    />
                                  </li>
                                )
                              })}
                            </ul>
                          </>
                        )
                      }
                    })}
                  </ul>
                </div>
              </li>
            )
          })}
          {bonuses.map((bonus: any) => {
            return (
              <li key={bonus._id} className="flex space-x-6">
                <div className="shrink-0">
                  <Image src={bonus.image} alt="" width={200} height={200} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl">{bonus.title}</h3>
                  <ul>
                    {bonus.lessons.map((lesson: any) => {
                      return (
                        <Link
                          key={lesson._id}
                          href={`/workshops/${bonus.slug.current}/${lesson.slug}`}
                          className="block"
                        >
                          {lesson.title}
                        </Link>
                      )
                    })}
                  </ul>
                </div>
              </li>
            )
          })}
        </ul>
      </main>
    </Layout>
  )
}

export default Learn
