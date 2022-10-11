import Layout from 'components/app/layout'
import {Header} from 'components/home/home-header'
import {Copy} from 'components/home/home-body-copy'
import {SubscribeToNewsletter} from 'components/home/home-newsletter-cta'
import * as React from 'react'
import {useSkillLevel} from 'components/home/use-skill-level'

export const HomeTemplate = (props: {level?: string}) => {
  const level = useSkillLevel(props.level)
  return (
    <Layout
      meta={{
        title: `Professional TypeScript Training by Matt Pocock `,
      }}
    >
      <Header level={level} />
      <main>
        <Copy level={level} />
        <SubscribeToNewsletter level={level} />
      </main>
    </Layout>
  )
}
