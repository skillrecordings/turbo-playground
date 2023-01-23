import {type SanityDocument} from '@sanity/client'
import * as React from 'react'
import cx from 'classnames'
import MuxPlayer, {type MuxPlayerProps} from '@mux/mux-player-react'

import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {type Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'

import {
  BlockedOverlay,
  DefaultOverlay,
  ExerciseOverlay,
  FinishedOverlay,
  LoadingOverlay,
  FinishedSectionOverlay,
} from './exercise-overlay'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'

type VideoProps = {
  ref: any
  tutorialFiles: any
}

export const Video: React.FC<VideoProps> = React.forwardRef(
  ({tutorialFiles}, ref: any) => {
    const {lesson} = useLesson()
    const isExercise = Boolean(lesson._type === 'exercise')
    const {videoResource, loadingVideoResource} = useVideoResource()
    const {
      muxPlayerProps,
      displayOverlay,
      nextExercise,
      canShowVideo,
      loadingUserStatus,
      nextSection,
    } = useMuxPlayer()

    return (
      <>
        {displayOverlay && (
          <>
            {nextExercise ? (
              <>
                {isExercise ? (
                  <ExerciseOverlay tutorialFiles={tutorialFiles} />
                ) : (
                  <DefaultOverlay />
                )}
              </>
            ) : nextSection ? (
              <FinishedSectionOverlay />
            ) : (
              <FinishedOverlay />
            )}
          </>
        )}
        <div
          className={cx('relative flex w-full items-center justify-center', {
            hidden: displayOverlay,
          })}
        >
          {canShowVideo && !loadingVideoResource ? (
            <MuxPlayer
              ref={ref}
              {...(muxPlayerProps as MuxPlayerProps)}
              playbackId={videoResource?.muxPlaybackId}
            />
          ) : (
            <>
              {loadingUserStatus || loadingVideoResource ? (
                <LoadingOverlay />
              ) : (
                <BlockedOverlay />
              )}
            </>
          )}
        </div>
      </>
    )
  },
)
