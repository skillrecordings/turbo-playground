import React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/legacy/image'
import Link from 'next/link'
import cx from 'classnames'
import {CourseJsonLd} from '@skillrecordings/next-seo'
import {PortableText} from '@portabletext/react'
import {IconGithub} from 'components/icons'
import {isBrowser} from 'utils/is-browser'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import first from 'lodash/first'
import isEmpty from 'lodash/isEmpty'
import * as Accordion from '@radix-ui/react-accordion'
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
} from '@heroicons/react/solid'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import PortableTextComponents from '../video/portable-text'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import * as process from 'process'
import {trpc} from '../trpc/trpc.client'
import Balancer from 'react-wrap-balancer'

const WorkshopTemplate: React.FC<{
  workshop: Module
}> = ({workshop}) => {
  const {title, body, ogImage, image, description} = workshop
  const pageTitle = `${title} Workshop`

  return (
    <Layout
      className="mx-auto w-full pt-24 lg:max-w-4xl lg:pb-24"
      meta={{
        title: pageTitle,
        description,
        ogImage: {
          url: ogImage,
          alt: pageTitle,
        },
      }}
    >
      <CourseMeta title={pageTitle} description={description} />
      <Header workshop={workshop} />
      <main className="relative z-10 flex flex-col gap-5 lg:flex-row">
        <article className="prose prose-lg w-full max-w-none px-5 text-white lg:max-w-xl">
          <PortableText value={body} components={PortableTextComponents} />
        </article>
        {workshop && <WorkshopSectionNavigator workshop={workshop} />}
      </main>
    </Layout>
  )
}

export default WorkshopTemplate

const Header: React.FC<{
  workshop: Module
}> = ({workshop}) => {
  const {title, slug, sections, image, github} = workshop
  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: workshop.slug.current,
    })

  const isModuleInProgress = (moduleProgress?.completedLessonCount || 0) > 0
  const nextSection = moduleProgress?.nextSection
  const nextLesson = moduleProgress?.nextLesson

  const firstSection = first<Section>(sections)
  const firstLesson = first<Lesson>(firstSection?.lessons)

  return (
    <>
      <header className="relative z-10 flex flex-col-reverse items-center justify-between px-5 pt-0 pb-16 sm:pt-8 sm:pb-8 md:flex-row">
        <div className="text-center md:text-left">
          <Link
            href="/workshops"
            className="pb-1 font-mono text-sm font-semibold uppercase tracking-wide text-cyan-300"
          >
            Pro Workshop
          </Link>
          <h1 className="font-text text-4xl font-bold sm:text-5xl lg:text-6xl">
            <Balancer>{title}</Balancer>
          </h1>
          <div className="pt-8 text-lg">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center overflow-hidden rounded-full">
                  <Image
                    src={require('../../public/matt-pocock.jpeg')}
                    alt="Matt Pocock"
                    width={48}
                    height={48}
                  />
                </div>
                <span>Matt Pocock</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 pt-8 md:justify-start">
              {firstSection && (
                <Link
                  href={{
                    pathname: '/workshops/[module]/[section]/[lesson]',
                    query: {
                      module: slug.current,
                      section: isModuleInProgress
                        ? nextSection?.slug
                        : firstSection.slug,
                      lesson: isModuleInProgress
                        ? nextLesson?.slug
                        : firstLesson?.slug,
                    },
                  }}
                  className={cx(
                    'flex items-center justify-center rounded bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:bg-cyan-300',
                    {
                      'animate-pulse': moduleProgressStatus === 'loading',
                    },
                  )}
                  onClick={() => {
                    track('clicked start learning', {module: slug.current})
                  }}
                >
                  {isModuleInProgress ? 'Continue' : 'Start'} Learning
                  <span className="pl-2" aria-hidden="true">
                    →
                  </span>
                </Link>
              )}
              {github?.repo && (
                <a
                  className="flex items-center justify-center gap-2 rounded-md border-2 border-gray-800 px-5 py-3 font-medium transition hover:bg-gray-800"
                  href={`https://github.com/total-typescript/${github.repo}`}
                  onClick={() => {
                    track('clicked github code link', {module: slug.current})
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconGithub className="w-6" /> Code
                </a>
              )}
            </div>
          </div>
        </div>
        {image && (
          <div className="flex items-center justify-center lg:-mr-16">
            <Image
              src={image}
              alt={title}
              width={500}
              height={500}
              quality={100}
            />
          </div>
        )}
      </header>
      <Image
        layout="fill"
        aria-hidden="true"
        alt=""
        src={require('../../public/assets/landing/bg-divider-3.png')}
        objectPosition={'top'}
        className="-z-10 object-contain"
      />
    </>
  )
}

const WorkshopSectionNavigator: React.FC<{
  workshop: Module
}> = ({workshop}) => {
  const {sections} = workshop
  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: workshop.slug.current,
    })
  const nextSection = moduleProgress?.nextSection
  const initialOpenedSections = !isEmpty(first(sections))
    ? [first(sections)?.slug]
    : []
  const [openedSections, setOpenedSections] = React.useState<string[]>(
    initialOpenedSections as string[],
  )

  React.useEffect(() => {
    nextSection?.slug && setOpenedSections([nextSection?.slug])
  }, [nextSection?.slug])

  return (
    <nav
      aria-label="workshop navigator"
      className="w-full bg-black/20 px-5 py-8 lg:max-w-xs lg:bg-transparent lg:px-0 lg:py-0"
    >
      {sections && (
        <Accordion.Root
          type="multiple"
          onValueChange={(e) => setOpenedSections(e)}
          value={moduleProgressStatus === 'success' ? openedSections : []}
        >
          <div className="flex w-full items-center justify-between pb-3">
            <h2 className="text-2xl font-semibold">Contents</h2>
            <h3
              className="cursor-pointer font-mono text-sm font-semibold uppercase text-gray-300"
              onClick={() => {
                setOpenedSections(
                  !isEmpty(openedSections)
                    ? []
                    : sections.map(({slug}: {slug: string}) => slug),
                )
              }}
            >
              {sections?.length || 0} Sections
            </h3>
          </div>
          <ul className="flex flex-col gap-2">
            {sections.map((section: Section, i: number) => {
              return (
                <SectionItem
                  key={section.slug}
                  section={section}
                  workshop={workshop}
                />
              )
            })}
          </ul>
        </Accordion.Root>
      )}
    </nav>
  )
}

const SectionItem: React.FC<{
  section: Section
  workshop: Module
}> = ({section, workshop}) => {
  const {data: moduleProgress} = trpc.moduleProgress.bySlug.useQuery({
    slug: workshop.slug.current,
  })
  const sectionProgress = moduleProgress?.sections?.find(
    (s) => s.id === section._id,
  )
  const isSectionCompleted = sectionProgress?.sectionCompleted
  const sectionPercentComplete = sectionProgress?.percentComplete

  return (
    <li key={section.slug}>
      <Accordion.Item value={section.slug}>
        <Accordion.Header className="relative z-10 overflow-hidden rounded-lg bg-gray-900">
          <Accordion.Trigger className="group relative z-10 flex w-full items-center justify-between rounded-lg border border-white/5 bg-gray-800/20 py-2.5 px-3 text-left text-lg font-medium leading-tight shadow-lg transition hover:bg-gray-800/40">
            <Balancer>{section.title}</Balancer>
            <div className="flex items-center">
              {isSectionCompleted && (
                <CheckIcon
                  className="mr-2 h-4 w-4 text-teal-400"
                  aria-hidden="true"
                />
              )}
              <ChevronDownIcon
                className="relative h-3 w-3 opacity-70 transition group-hover:opacity-100 group-radix-state-open:rotate-180"
                aria-hidden="true"
              />
            </div>
          </Accordion.Trigger>
          <div
            aria-hidden="true"
            className={`absolute left-0 top-0 h-full bg-white/5`}
            style={{width: `${sectionPercentComplete}%`}}
          />
        </Accordion.Header>
        <Accordion.Content>
          <WorkshopSectionExerciseNavigator
            workshop={workshop}
            section={section}
          />
        </Accordion.Content>
      </Accordion.Item>
    </li>
  )
}

const LessonListItem = ({
  lessonResource,
  section,
  workshop,
  index,
}: {
  lessonResource: Lesson
  section: Section
  workshop: Module
  index: number
}) => {
  const {data: moduleProgress} = trpc.moduleProgress.bySlug.useQuery({
    slug: workshop.slug.current,
  })

  const completedLessons = moduleProgress?.lessons.filter(
    (l) => l.lessonCompleted,
  )
  const nextLesson = moduleProgress?.nextLesson
  const completedLessonCount = moduleProgress?.completedLessonCount || 0

  const isExerciseCompleted = completedLessons?.find(
    ({id}) => id === lessonResource._id,
  )

  const isNextLesson = nextLesson?.slug === lessonResource.slug
  return (
    <li key={lessonResource._id}>
      <Link
        href={{
          pathname: '/workshops/[module]/[section]/[lesson]',
          query: {
            section: section.slug,
            lesson: lessonResource.slug,
            module: workshop.slug.current,
          },
        }}
        passHref
        className={cx(
          'group inline-flex w-full flex-col justify-center py-2.5 pl-3.5 pr-3 text-base font-medium',
          {
            'bg-gradient-to-r from-cyan-300/5 to-transparent': isNextLesson,
          },
        )}
        onClick={() => {
          track('clicked workshop exercise', {
            module: workshop.slug.current,
            lesson: lessonResource.slug,
            section: section.slug,
            moduleType: section._type,
            lessonType: lessonResource._type,
          })
        }}
      >
        {isNextLesson && completedLessonCount > 0 && (
          <div className="flex items-center gap-1 pb-1">
            <ArrowRightIcon
              aria-hidden="true"
              className="mr-1.5 -ml-1 h-4 w-4 text-cyan-300"
            />
            <div className="font-mono text-xs font-semibold uppercase tracking-wide text-cyan-300">
              CONTINUE
            </div>
          </div>
        )}
        <div className="inline-flex items-center">
          {isExerciseCompleted ? (
            <CheckIcon
              className="mr-[11.5px] -ml-1 h-4 w-4 text-teal-400"
              aria-hidden="true"
            />
          ) : (
            <span
              className="w-6 font-mono text-xs text-gray-400"
              aria-hidden="true"
            >
              {index + 1}
            </span>
          )}
          <span className="w-full cursor-pointer leading-tight group-hover:underline">
            {lessonResource.title}
          </span>
        </div>
      </Link>
    </li>
  )
}

const WorkshopSectionExerciseNavigator: React.FC<{
  section: Section
  workshop: Module
}> = ({section, workshop}) => {
  const {lessons} = section

  return lessons ? (
    <ul className="-mt-5 rounded-b-lg border border-white/5 bg-black/20 pt-7 pb-3">
      {lessons.map((exercise: Lesson, i: number) => {
        return (
          <LessonListItem
            key={exercise.slug}
            lessonResource={exercise}
            section={section}
            workshop={workshop}
            index={i}
          />
        )
      })}
    </ul>
  ) : null
}

const CourseMeta = ({
  title,
  description,
}: {
  title: string
  description?: string | null
}) => (
  <CourseJsonLd
    courseName={title}
    description={description || process.env.NEXT_PUBLIC_PRODUCT_DESCRIPTION}
    provider={{
      name: `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`,
      type: 'Person',
      url: isBrowser() ? document.location.href : process.env.NEXT_PUBLIC_URL,
    }}
  />
)
