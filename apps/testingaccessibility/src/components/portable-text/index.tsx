import React from 'react'
import type {ArbitraryTypedObject, PortableTextBlock} from '@portabletext/types'
import {
  PortableText,
  PortableTextComponents,
  PortableTextMarkComponentProps,
} from '@portabletext/react'
import {useSelector} from '@xstate/react'
import {
  HLSSource,
  Player,
  selectIsFullscreen,
  useVideo,
} from '@skillrecordings/player'
import js from 'refractor/lang/javascript'
import Refractor from 'react-refractor'
import Image from 'next/image'
import cx from 'classnames'

Refractor.registerLanguage(js)

const Video: React.FC<{url: string; title: string}> = ({url, title}) => {
  const fullscreenWrapperRef = React.useRef<HTMLDivElement>(null)
  const videoService: any = useVideo()
  const isFullscreen = useSelector(videoService, selectIsFullscreen)
  const poster = url
    .replace('stream.mux.com', 'image.mux.com')
    .replace('.m3u8', '/thumbnail.png?width=1600&height=1000&fit_mode=pad')
  return (
    <div
      ref={fullscreenWrapperRef}
      className={cx('w-full', {
        'absolute top-0 left-0 z-50': isFullscreen,
        relative: !isFullscreen,
      })}
    >
      <Player
        aria-label={title}
        container={fullscreenWrapperRef.current || undefined}
        aspectRatio="8:5"
        className={'font-sans'}
        poster={poster}
      >
        {url && <HLSSource src={url} />}
      </Player>
    </div>
  )
}

// https://github.com/portabletext/react-portabletext

const PortableTextComponents: PortableTextComponents = {
  marks: {
    emoji: ({text, value}: EmojiProps) => {
      const label = value.emoji.label
      return (
        <span role="img" aria-label={label} aria-hidden={!label}>
          {text}
        </span>
      )
    },
  },
  types: {
    bodyVideo: ({value}: BodyVideoProps) => {
      const {url, title, caption} = value
      return (
        <figure>
          <Video url={url} title={title} />
          <figcaption>
            <details>
              <summary>Video Transcript</summary>
              <PortableText value={caption} />
            </details>
          </figcaption>
        </figure>
      )
    },
    bodyImage: ({value}: BodyImageProps) => {
      const {url, alt, caption} = value
      return (
        <figure className="relative w-full aspect-w-8 aspect-h-5">
          <Image src={url} alt={alt} layout="fill" objectFit="contain" />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      )
    },
    code: ({value}: CodeProps) => {
      const {language, code, highlightedLines} = value
      return (
        <Refractor
          language={language}
          value={code}
          markers={highlightedLines}
        />
      )
    },
    callout: ({value}: CalloutProps) => {
      const {body, type} = value

      return (
        <div className={cx(`p-5 rounded-lg`, getCalloutStyles(type))}>
          <div>
            <span role="img" aria-label={getCalloutImage(type).alt}>
              {getCalloutImage(type).src}
            </span>{' '}
            <b className="font-bold">{getCalloutTitle(type)}</b>
          </div>
          <PortableText value={body} />
        </div>
      )
    },
  },
}

type EmojiProps = PortableTextMarkComponentProps<any>

type CalloutProps = {
  value: {
    body: PortableTextBlock | ArbitraryTypedObject
    type: string
  }
}

type BodyVideoProps = {
  value: {
    url: string
    title: string
    caption: PortableTextBlock | ArbitraryTypedObject
  }
}

type BodyImageProps = {
  value: {
    url: string
    alt: string
    caption: PortableTextBlock | ArbitraryTypedObject
  }
}

type CodeProps = {
  value: {
    language: string
    code: string
    highlightedLines: (number | Refractor.Marker)[]
  }
}

const getCalloutStyles = (type: string): string => {
  switch (type) {
    case 'tip':
      return 'bg-green-100 text-green-800'
    case 'big-idea':
      return 'bg-blue-100 text-blue-800'
    case 'reflection':
      return 'bg-orange-100 text-orange-800'
    case 'caution':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getCalloutTitle = (type: string): string => {
  switch (type) {
    case 'tip':
      return 'Tip'
    case 'big-idea':
      return 'Big Idea'
    case 'reflection':
      return 'Reflection'
    case 'caution':
      return 'Caution'
    default:
      return 'Callout'
  }
}

const getCalloutImage = (type: string): {alt: string; src: string} => {
  switch (type) {
    case 'tip':
      return {alt: 'light bulp', src: '💡'}
    case 'big-idea':
      return {alt: 'exploding head', src: '🤯'}
    case 'reflection':
      return {alt: 'smiling face with sunglasses', src: '😎'}
    case 'caution':
      return {alt: 'warning', src: '⚠️'}
    default:
      return {alt: 'speech baloon', src: '💬'}
  }
}

export default PortableTextComponents
