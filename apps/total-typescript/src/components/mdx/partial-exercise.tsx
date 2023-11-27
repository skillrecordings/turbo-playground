import {LayoutGroup, motion} from 'framer-motion'
import {
  Box,
  Green,
  HighlightBox,
  ObjectTypeOfStrings,
  RangeInput,
  TypeHelperAndVariable,
} from './interactive-code-elements'
import {useDelayedState} from './use-delayed-state'

export const PartialExample = () => {
  const numOfKeys = useDelayedState(3)

  const possibleKeys = ['a', 'b', 'c', 'd', 'e']

  const keys = possibleKeys.slice(0, numOfKeys.delayedValue)

  return (
    <div className="not-prose flex flex-col rounded bg-gray-800 text-base">
      <LayoutGroup>
        <Box className="flex justify-center space-x-12 bg-gray-700 p-6">
          <RangeInput
            label="Input Keys"
            onChange={(value) => {
              numOfKeys.set(value)
            }}
            value={numOfKeys.currentValue}
            min={1}
            max={possibleKeys.length}
          ></RangeInput>
        </Box>

        <motion.div layout className="space-y-8 p-10 px-12">
          <LayoutGroup>
            <ObjectTypeOfStrings
              typeName="Input"
              keys={keys.map((key) => ({key}))}
            ></ObjectTypeOfStrings>
            <motion.div layout>
              <TypeHelperAndVariable
                typeName="Partial"
                variableName="Result"
                arguments={[
                  {
                    key: 'Input',
                    node: <Green>Input</Green>,
                  },
                ]}
              ></TypeHelperAndVariable>
              <HighlightBox className="">
                <ObjectTypeOfStrings
                  typeName="Result"
                  keys={keys.map((key) => ({key, optional: true}))}
                ></ObjectTypeOfStrings>
              </HighlightBox>
            </motion.div>
          </LayoutGroup>
        </motion.div>
      </LayoutGroup>
    </div>
  )
}
