import {SanityDocument} from '@sanity/client'
import * as React from 'react'
import {useMuxPlayer} from '../../hooks/use-mux-player'
import {
  BlockedOverlay,
  DefaultOverlay,
  ExerciseOverlay,
  FinishedOverlay,
  LoadingOverlay,
  FinishedSectionOverlay,
} from '../exercise-overlay'
import cx from 'classnames'
import MuxPlayer, {MuxPlayerProps} from '@mux/mux-player-react'
import {LessonResource} from '../../lib/lesson-resources'
import {useVideoResource} from '../../video/use-video-resource'

type VideoProps = {
  module: SanityDocument
  section?: SanityDocument
  exercise: LessonResource
  ref: any
}

export const Video: React.FC<VideoProps> = React.forwardRef(
  ({module, exercise, section}, ref: any) => {
    const isExercise = Boolean(exercise._type === 'exercise')
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
              <>{isExercise ? <ExerciseOverlay /> : <DefaultOverlay />}</>
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
