import * as React from 'react'
import {
  Question,
  QuestionHeader,
  QuestionBody,
  QuestionFooter,
  QuestionAnswer,
  QuestionSubmit,
  QuestionProps,
  QuestionInput,
} from './index'

const Essay: React.FC<{
  question: QuestionProps
}> = ({question}) => {
  return question ? (
    <>
      <Question {...question}>
        <QuestionHeader />
        <QuestionBody>
          <QuestionInput />
          <QuestionSubmit>Submit</QuestionSubmit>
          <QuestionAnswer />
        </QuestionBody>
        <QuestionFooter />
      </Question>
    </>
  ) : null
}

export default Essay
