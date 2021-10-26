import * as React from 'react'
import {GetServerSideProps, GetServerSidePropsContext} from 'next'
import getConfig from '@skillrecordings/quiz/dist/config'
import {QuizAnswerPage, transformSanityQuiz} from '@skillrecordings/quiz'
import {QuestionSet} from '@skillrecordings/types'
import {sanityClient} from 'utils/sanity-client'
import Layout from 'components/app/layout'
import isEmpty from 'lodash/isEmpty'
import groq from 'groq'

const QUIZ_SLUG = 'email-course'

const Answer: React.FC<{quiz: any}> = ({quiz}) => {
  const questionSet: QuestionSet = transformSanityQuiz(quiz)

  return (
    <Layout noIndex meta={{title: 'Quiz'}}>
      <div className="py-16">
        <QuizAnswerPage
          questionSet={questionSet}
          config={getConfig('CSS Destructured', 'Emma Bostian')}
        />
      </div>
    </Layout>
  )
}

const quizQuery = groq`*[_type == "quiz" && slug.current == $slug][0]{
  title,
  'slug': slug.current,
  questions[] {
    id,
    type,
    tagId,
    answer,
    'question': body,
    'correct': choices[correct == true].value,
    choices[] {
      'answer': value,
      label,
      correct,
      'image': image.asset->url
    },
  }
  }`

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const data = await sanityClient.fetch(quizQuery, {slug: QUIZ_SLUG})

  if (isEmpty(data)) {
    return {
      notFound: true,
    }
  }

  return {
    props: {quiz: data},
  }
}

export default Answer
