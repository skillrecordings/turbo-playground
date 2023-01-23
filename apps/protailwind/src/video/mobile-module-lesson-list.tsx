import * as React from 'react'
import {SanityDocument} from '@sanity/client'
import capitalize from 'lodash/capitalize'

import ModuleLessonListHeader from './module-lesson-list-header'
import {LessonList} from './lesson-list'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'

export const MobileModuleLessonList: React.FC<{
  module: Module
  section?: Section
  path: string
}> = ({module, path, section}) => {
  const exerciseCount = section
    ? section.lessons && section.lessons.length
    : module.lessons && module.lessons.length
  return (
    <details className="no-marker group block border-t-2 border-gray-900 lg:hidden">
      <summary className=" flex cursor-pointer items-center gap-1 bg-white px-4 py-3 font-medium shadow-lg shadow-gray-300/30 transition marker:content-[''] after:absolute after:right-3 after:flex after:h-6 after:w-6 after:rotate-180 after:items-center after:justify-center after:rounded-full after:bg-gray-100 after:text-lg after:content-['↑'] group-open:after:rotate-0 hover:bg-gray-50">
        {module.title} {capitalize(module.moduleType)}{' '}
        <span className="text-sm opacity-80">
          ({exerciseCount || 0} exercises)
        </span>
      </summary>
      <ModuleLessonListHeader module={module} path={path} section={section}>
        <LessonList path={path} />
      </ModuleLessonListHeader>
    </details>
  )
}
