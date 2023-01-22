import {NextRouter, useRouter} from 'next/router'
import {Section} from '../schemas/section'
import {Module} from '../schemas/module'

export const handlePlayFromBeginning = ({
  router,
  section,
  module,
  path,
  handlePlay = () => {},
}: {
  router: NextRouter
  section?: Section
  module: Module
  path: string
  handlePlay: () => void
}) => {
  router
    .push({
      pathname: section
        ? `/${path}/[module]/[section]/[lesson]`
        : `/${path}/[module]/[lesson]`,
      query: section
        ? {
            module: module.slug.current,
            section: module.sections && module.sections[0].slug,
            lesson:
              module.sections &&
              module.sections[0].lessons &&
              module.sections[0].lessons[0].slug,
          }
        : {
            module: module.slug.current,
            lesson: module.lessons && module.lessons[0].slug,
          },
    })
    .then(handlePlay)
}
