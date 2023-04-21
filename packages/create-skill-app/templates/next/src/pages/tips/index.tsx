import Layout from 'components/app/layout'
import {getAllTips, type Tip} from 'lib/tips'
import {GetStaticProps} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import config from 'config'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'

export const getStaticProps: GetStaticProps = async (context) => {
  const tips = await getAllTips()

  return {
    props: {tips},
    revalidate: 10,
  }
}

const Tips: React.FC<{tips: Tip[]}> = ({tips}) => {
  return (
    <Layout meta={{title: 'Tips'}}>
      <header className="px-5 py-24">
        <h1 className="text-center text-4xl font-bold">Tips</h1>
      </header>
      <main className="mx-auto w-full max-w-screen-lg px-5">
        <ul className="flex flex-wrap justify-center gap-5">
          {tips.map((tip) => {
            const {title, summary, slug} = tip
            return (
              <li key={slug} className="w-full">
                <Link
                  href={{
                    pathname: '/tips/[tip]',
                    query: {
                      tip: slug,
                    },
                  }}
                  passHref
                  onClick={() => {
                    track('clicked view tip', {
                      tip: slug,
                    })
                  }}
                >
                  <article className="mx-auto w-full max-w-screen-md">
                    <div className="py-5">
                      <h2 className="text-3xl font-bold">{title}</h2>
                      {summary && <p>{summary}</p>}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Image
                        src={require('../../../public/instructor.png')}
                        alt={config.author}
                        width={40}
                        height={40}
                        placeholder="blur"
                        className="rounded-full bg-gray-200"
                      />
                      <span>{config.author}</span>
                    </div>
                  </article>
                </Link>
              </li>
            )
          })}
        </ul>
      </main>
    </Layout>
  )
}

export default Tips
