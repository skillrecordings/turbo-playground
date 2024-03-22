import {ImageResponse} from '@vercel/og'
import {NextRequest} from 'next/server'
import type React from 'react'

export const config = {
  runtime: 'edge',
}

const getTemplateByType = (
  title: string,
  type?: string,
  muxPlaybackId?: string,
  image?: string,
  bgImage?: string,
  authorName?: string,
  authorImage?: string,
) => {
  switch (type) {
    case 'video':
      return (
        <VideoTemplate
          title={title}
          // contributor={contributor}
          image={image}
        />
      )
    case 'interview':
      return <InterviewTemplate image={image} title={title} />

    case 'background-thumbnail':
      return (
        <BackgroundThumbnailTemplate
          bgImage={bgImage}
          muxPlaybackId={muxPlaybackId}
          title={title}
          image={image}
          authorName={authorName}
          authorImage={authorImage}
        />
      )
    default:
      return <DefaultTemplate title={title} image={image} />
  }
}

const dmSansMedium = fetch(
  new URL('../../../../public/fonts/DMSans-Medium.ttf', import.meta.url),
).then((res) => res.arrayBuffer())
const dmSansBold = fetch(
  new URL('../../../../public/fonts/DMSans-Bold.ttf', import.meta.url),
).then((res) => res.arrayBuffer())

export default async function handler(req: NextRequest) {
  const dmSansMediumData = await dmSansMedium
  const dmSansBoldData = await dmSansBold

  try {
    const {searchParams} = new URL(req.url)
    const hasTitle = searchParams.has('title')
    const hasByline = searchParams.has('byline')
    const byline = hasByline ? searchParams.get('byline') : ''
    let title = 'My Default Title'
    if (hasTitle) {
      title = searchParams.get('title')?.slice(0, 100) || 'My Default Title'
    }
    const hasImage = searchParams.has('image')
    let image: string | undefined
    if (hasImage) {
      image = searchParams.get('image') || undefined
    }
    const hasMuxPlaybackId = searchParams.has('muxPlaybackId')
    let muxPlaybackId: string | undefined
    if (hasMuxPlaybackId) {
      muxPlaybackId = searchParams.get('muxPlaybackId') || undefined
    }
    const hasType = searchParams.has('type')
    let type: string | undefined
    if (hasType) {
      type = searchParams.get('type') || undefined
    }

    const hasBgImage = searchParams.has('bgImage')
    let bgImage: string | undefined
    if (hasBgImage) {
      bgImage = searchParams.get('bgImage') || undefined
    }

    const hasAuthorName = searchParams.has('authorName')
    let authorName: string | undefined
    if (hasAuthorName) {
      authorName = searchParams.get('authorName') || 'Kent C. Dodds'
    }

    const hasAuthorImage = searchParams.has('authorImage')
    let authorImage: string | undefined
    if (hasAuthorImage) {
      authorImage =
        searchParams.get('authorImage') ||
        'https://www.epicweb.dev/kent-c-dodds.png'
    }

    return new ImageResponse(
      getTemplateByType(
        title,
        type,
        muxPlaybackId,
        image,
        bgImage,
        authorName,
        authorImage,
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'DM Sans',
            data: dmSansMediumData,
            style: 'normal',
            weight: 400,
          },
          {
            name: 'DM Sans',
            data: dmSansBoldData,
            style: 'normal',
            weight: 600,
          },
        ],
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}

const DefaultTemplate: React.FC<{title: string; image?: string}> = ({
  title,
  image,
}) => {
  return (
    <div
      tw="flex w-full relative justify-center text-white items-center h-full justify-between"
      style={{
        backgroundColor: '#080B16',
      }}
    >
      <div
        tw="absolute flex items-center justify-end h-5 w-full bottom-0 left-0 pr-6"
        style={{background: '#4F75FF'}}
      ></div>

      <div tw="flex-1 flex flex-col justify-between h-full pt-12 pb-24 relative px-14">
        {image ? (
          <div tw="flex items-center">
            <img src={image} width={200} height={200} tw="mr-10" />
          </div>
        ) : (
          <Logo />
        )}
        <p
          tw="tracking-tight font-bold leading-tight"
          style={{
            fontSize: '4rem',
            fontFamily: 'DM Sans',
            lineHeight: 1.1,
          }}
        >
          {title}
        </p>
        {/* {!hasImage && (
          <div tw="flex items-center absolute right-14 top-12">
            <img src={authorImage} tw="h-24 rounded-full bg-gray-800" />
            <p
              style={{fontSize: 36, fontFamily: 'DM Sans'}}
              tw="text-3xl ml-6 mb-6 text-gray-300"
            >
              {authorName}
            </p>
          </div>
        )} */}
      </div>
    </div>
  )
}

const VideoTemplate: React.FC<{
  title: string
  contributor?: {
    name: string
    image?: string
  }
  image?: string
}> = ({title, image}) => {
  return (
    <div
      tw="flex w-full relative justify-center text-white items-center h-full"
      style={{
        background: 'linear-gradient(254deg, #2C344E 1.81%, #0B132E 95.83%)',
      }}
    >
      {image && (
        <img
          src={image}
          tw="absolute right-0 bottom-0 opacity-90 rounded-md shadow-2xl"
          style={{
            aspectRatio: '480/270',
            height: 630,
          }}
        />
      )}

      <div
        tw="w-32 h-32 items-center justify-center rounded-full flex absolute right-56 text-white shadow-2xl"
        style={{
          background: 'linear-gradient(225deg, #4F75FF 29.29%, #30AFFF 70.6%)',
        }}
      >
        <div tw="flex items-center justify-center ml-2">
          <svg
            width={40}
            height={40}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
          >
            <g fill="currentColor">
              <path
                fill="currentColor"
                d="M14,7.999c0-0.326-0.159-0.632-0.427-0.819l-10-7C3.269-0.034,2.869-0.058,2.538,0.112 C2.207,0.285,2,0.626,2,0.999v14.001c0,0.373,0.207,0.715,0.538,0.887c0.331,0.17,0.73,0.146,1.035-0.068l10-7 C13.841,8.633,14,8.327,14,8.001C14,8,14,8,14,7.999C14,8,14,8,14,7.999z"
              ></path>
            </g>
          </svg>
        </div>
      </div>
      <div tw="flex absolute left-0 top-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="715"
          height="630"
          viewBox="0 0 715 630"
          fill="none"
        >
          <path d="M0 0H715L594 630H0V0Z" fill="url(#paint0_linear_669_3995)" />
          <defs>
            <linearGradient
              id="paint0_linear_669_3995"
              x1="704.328"
              y1="18.1731"
              x2="-78.1359"
              y2="275.78"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#2C344E" />
              <stop offset="1" stopColor="#0B132E" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div tw="absolute left-16 top-16 z-10 flex">
        <Logo />
      </div>
      <div tw="w-1/2 left-16 absolute z-10 flex bottom-24 pr-16">
        <p
          tw="tracking-tight font-bold leading-tight"
          style={{
            fontSize: '2.75rem',
            fontFamily: 'DM Sans',
            lineHeight: 1.1,
          }}
        >
          {title}
        </p>
      </div>
    </div>
  )
}

const InterviewTemplate: React.FC<{image?: string; title: string}> = ({
  image,
  title,
}) => {
  return (
    <div
      tw="flex w-full relative justify-center text-white items-center h-full"
      style={{
        background: 'linear-gradient(254deg, #2C344E 1.81%, #0B132E 95.83%)',
      }}
    >
      {image && (
        <img
          src={image}
          tw="absolute -right-1/4 bottom-0 opacity-90 rounded-md shadow-2xl z-0"
          style={{
            aspectRatio: '480/270',
            height: 630,
          }}
        />
      )}

      <svg
        className="relative"
        xmlns="http://www.w3.org/2000/svg"
        width="715"
        height="630"
        viewBox="0 0 715 630"
        fill="none"
      >
        <path d="M0 0H715L594 630H0V0Z" fill="url(#paint0_linear_669_3995)" />
        <defs>
          <linearGradient
            id="paint0_linear_669_3995"
            x1="704.328"
            y1="18.1731"
            x2="-78.1359"
            y2="275.78"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#2C344E" />
            <stop offset="1" stopColor="#0B132E" />
          </linearGradient>
        </defs>
      </svg>
      <div
        tw="w-32 h-32 items-center justify-center z-50 rounded-full flex absolute z-10 right-[480px] text-white shadow-2xl"
        style={{
          background: 'linear-gradient(225deg, #4F75FF 29.29%, #30AFFF 70.6%)',
        }}
      >
        <div tw="w-10 h-10 ml-2 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <g fill="currentColor">
              <path
                fill="currentColor"
                d="M14,7.999c0-0.326-0.159-0.632-0.427-0.819l-10-7C3.269-0.034,2.869-0.058,2.538,0.112 C2.207,0.285,2,0.626,2,0.999v14.001c0,0.373,0.207,0.715,0.538,0.887c0.331,0.17,0.73,0.146,1.035-0.068l10-7 C13.841,8.633,14,8.327,14,8.001C14,8,14,8,14,7.999C14,8,14,8,14,7.999z"
              ></path>
            </g>
          </svg>
        </div>
      </div>
      <div tw="absolute left-16 top-20 z-10 flex">
        <Logo />
      </div>

      <div tw="w-1/2 left-16 absolute z-10 flex-col flex bottom-32 pr-16">
        <p
          tw="tracking-tight font-bold leading-tight"
          style={{
            fontSize: '4rem',
            fontFamily: 'DM Sans',
            lineHeight: 0.9,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: '2rem',
            fontFamily: 'DM Sans',
            lineHeight: 1.1,
            color: '#93A1D7',
            opacity: 0.9,
          }}
        >
          is speaking at Epic Web Conf
        </p>
      </div>

      <div tw="flex-1 flex flex-col justify-between h-full pt-12 pb-24 relative px-14">
        {!image && (
          <div tw="flex items-center absolute right-14 top-12">
            <img
              src="https://www.epicweb.dev/kent-c-dodds.png"
              tw="h-24 rounded-full bg-gray-800"
            />
            <p
              style={{fontSize: 36, fontFamily: 'DM Sans'}}
              tw="text-3xl ml-6 mb-6 text-gray-300"
            >
              Kent C. Dodds
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const BackgroundThumbnailTemplate: React.FC<{
  title: string
  image?: string
  muxPlaybackId?: string
  bgImage?: string
  authorName?: string
  authorImage?: string
}> = ({title, image, bgImage, muxPlaybackId, authorName, authorImage}) => {
  const videoThumbnail =
    bgImage ||
    `https://image.mux.com/${muxPlaybackId}/thumbnail.jpg?width=1200&height=675&time=0`

  return (
    <div
      tw="flex w-full relative justify-center text-white items-center h-full"
      style={{
        background: 'linear-gradient(254deg, #080B16 0%, #12141E 100%)',
      }}
    >
      <div
        tw="absolute left-0 top-0 w-full h-full opacity-10"
        style={{
          filter: 'blur(3px)',
          width: 1200,
          height: 630,
          backgroundImage: `url(${videoThumbnail})`,
          backgroundSize: '1200px 675px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
      <div tw="flex flex-col items-center">
        <Logo />
        <h1 tw="mt-20 text-6xl leading-tight font-bold text-center w-full px-32">
          {title}
        </h1>
        {authorName && authorImage && (
          <div tw="flex items-center mt-10">
            <img src={authorImage} tw="h-20 rounded-full bg-gray-800" />
            <span tw="text-3xl ml-5">{authorName}</span>
          </div>
        )}
      </div>
    </div>
  )
}

const Logo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={264}
      height={70}
      fill="none"
      viewBox="0 0 264 70"
    >
      <g fill="currentColor">
        <path d="M92.593 36.536v6.189h9.061v2.453H90V25.662h11.515v2.454h-8.922v5.994h8.225v2.426h-8.225Z"></path>
        <path
          fillRule="evenodd"
          d="M109.942 25.662h7.081c1.813 0 3.29.614 4.489 1.813 1.199 1.198 1.812 2.676 1.812 4.46 0 1.757-.613 3.262-1.812 4.461-1.199 1.199-2.676 1.812-4.489 1.812h-4.488v6.97h-2.593V25.662Zm2.593 10.12h4.488c1.088 0 1.98-.362 2.677-1.086.697-.753 1.059-1.673 1.059-2.76 0-2.231-1.589-3.848-3.736-3.848h-4.488v7.695Z"
          clipRule="evenodd"
        />
        <path d="M131.126 43.379V27.342h-3.089v-1.828h8.809v1.828h-3.127V43.38h3.127v1.828h-8.809V43.38h3.089Zm21.11 2.161c-2.955 0-5.409-.975-7.332-2.927-1.924-1.951-2.872-4.349-2.872-7.193 0-2.843.948-5.241 2.872-7.193 1.923-1.951 4.377-2.927 7.332-2.927 3.569 0 6.747 1.84 8.42 4.74l-2.259 1.31c-1.115-2.147-3.485-3.54-6.161-3.54-2.258 0-4.098.724-5.52 2.174-1.422 1.45-2.119 3.262-2.119 5.436 0 2.147.697 3.96 2.119 5.41 1.422 1.449 3.262 2.174 5.52 2.174 2.676 0 5.046-1.394 6.161-3.513l2.259 1.282c-.809 1.45-1.98 2.621-3.485 3.485-1.506.865-3.151 1.283-4.935 1.283Z" />
        <path
          fillRule="evenodd"
          d="M101.654 42.725v2.453H90V25.662h11.515v2.454h-8.922v5.994h8.225v2.426h-8.225v6.189h9.061Zm-8.761-.3h9.061v3.053H89.7V25.362h12.115v3.054h-8.922v5.394h8.225v3.026h-8.225v5.589Zm16.749-17.063h7.381c1.889 0 3.444.643 4.701 1.9 1.257 1.257 1.9 2.812 1.9 4.673 0 1.834-.643 3.416-1.9 4.673-1.257 1.257-2.812 1.9-4.701 1.9h-4.188v6.97h-3.193V25.362Zm2.893 19.816h-2.593V25.662h7.081c1.813 0 3.29.614 4.489 1.813 1.199 1.198 1.812 2.676 1.812 4.46 0 1.757-.613 3.262-1.812 4.461-1.199 1.199-2.676 1.812-4.489 1.812h-4.488v6.97Zm15.502-17.836v-1.828h8.809v1.828h-3.127V43.38h3.127v1.828h-8.809V43.38h3.089V27.342h-3.089Zm2.789.3h-3.089v-2.428h9.409v2.428h-3.127V43.08h3.127v2.428h-9.409V43.08h3.089V27.642Zm30.239 2.507-2.789 1.618-.145-.279c-1.059-2.038-3.32-3.379-5.895-3.379-2.188 0-3.947.7-5.306 2.085-1.362 1.388-2.033 3.123-2.033 5.226 0 2.076.671 3.81 2.033 5.199 1.359 1.386 3.118 2.085 5.306 2.085 2.575 0 4.837-1.341 5.896-3.353l.144-.274 2.787 1.583-.145.26c-.837 1.499-2.047 2.708-3.598 3.599-1.554.891-3.25 1.322-5.084 1.322-3.028 0-5.561-1.003-7.546-3.017-1.982-2.01-2.958-4.485-2.958-7.404 0-2.918.976-5.392 2.958-7.403 1.985-2.014 4.518-3.017 7.546-3.017 3.672 0 6.951 1.894 8.68 4.89l.149.259Zm-48.23 5.334h4.188c1.012 0 1.823-.334 2.459-.993.643-.696.977-1.542.977-2.555 0-2.072-1.462-3.547-3.436-3.547h-4.188v7.095Zm6.865-.787c-.697.724-1.589 1.087-2.677 1.087h-4.488v-7.695h4.488c2.147 0 3.736 1.617 3.736 3.847 0 1.088-.362 2.008-1.059 2.76Zm40.805 6.337c-.8 1.33-1.92 2.413-3.334 3.225-1.506.865-3.151 1.283-4.935 1.283-2.955 0-5.409-.976-7.332-2.928-1.924-1.951-2.872-4.349-2.872-7.193 0-2.843.948-5.241 2.872-7.193 1.923-1.951 4.377-2.927 7.332-2.927 3.462 0 6.556 1.732 8.266 4.482l.131.218.023.04-2.259 1.31a6.226 6.226 0 0 0-.144-.263c-1.168-1.997-3.451-3.278-6.017-3.278-2.258 0-4.098.725-5.52 2.175-1.422 1.45-2.119 3.262-2.119 5.436 0 2.147.697 3.96 2.119 5.41 1.422 1.449 3.262 2.174 5.52 2.174 2.565 0 4.848-1.28 6.015-3.251.051-.086.1-.173.146-.262l2.259 1.282-.07.123c-.027.046-.053.092-.081.137Z"
          clipRule="evenodd"
        />
        <path d="M174.058 45.178h-3.011l-5.604-19.516h2.732l4.461 16.06 4.739-16.06h2.621l4.74 16.06 4.46-16.06h2.733l-5.604 19.516h-3.011l-4.628-15.585-4.628 15.585Zm27.294-8.643v6.19h9.061v2.453h-11.654V25.662h11.515v2.454h-8.922v5.994h8.225v2.425h-8.225Zm28.222-1.477c1.784.864 2.928 2.509 2.928 4.6 0 1.561-.558 2.872-1.645 3.931-1.088 1.06-2.426 1.59-4.015 1.59h-8.42V25.661h7.807c1.533 0 2.815.502 3.875 1.534 1.059 1.031 1.589 2.286 1.589 3.791 0 1.729-.697 3.095-2.119 4.07Zm-3.345-6.97h-5.214v5.966h5.214c1.644 0 2.899-1.31 2.899-2.983 0-.809-.279-1.506-.864-2.091-.558-.585-1.227-.892-2.035-.892Zm-5.214 14.665h5.827c1.756 0 3.095-1.394 3.095-3.179 0-.864-.307-1.617-.92-2.23-.586-.613-1.311-.92-2.175-.92h-5.827v6.329Z" />
        <path
          fillRule="evenodd"
          d="M174.281 45.478h-3.46l-5.777-20.116h3.359l4.241 15.27 4.507-15.27h3.069l4.507 15.27 4.241-15.27h3.359l-5.776 20.116h-3.461l-4.404-14.83-4.405 14.83Zm-.223-.3h-3.011l-5.604-19.516h2.732l4.461 16.06 4.739-16.06h2.621l4.74 16.06 4.46-16.06h2.733l-5.604 19.516h-3.011l-4.628-15.585-4.628 15.585Zm36.655-2.753v3.053h-12.254V25.362h12.115v3.054h-8.922v5.394h8.225v3.026h-8.225v5.589h9.061Zm-9.361.3v-6.19h8.225V34.11h-8.225v-5.994h8.922v-2.454h-11.515v19.516h11.654v-2.453h-9.061Zm16.77 2.753V25.362h8.107c1.607 0 2.966.53 4.084 1.619 1.118 1.088 1.68 2.42 1.68 4.006 0 1.66-.615 3.019-1.861 4.029 1.635.957 2.67 2.6 2.67 4.642 0 1.642-.59 3.03-1.736 4.146-1.146 1.117-2.561 1.674-4.224 1.674h-8.72Zm11.752-10.264a6.066 6.066 0 0 0-.3-.156c.094-.065.185-.131.273-.2 1.238-.958 1.846-2.256 1.846-3.87 0-1.506-.53-2.76-1.589-3.792-1.06-1.032-2.342-1.534-3.875-1.534h-7.807v19.516h8.42c1.589 0 2.927-.53 4.015-1.589 1.087-1.06 1.645-2.37 1.645-3.931 0-1.971-1.017-3.546-2.628-4.444Zm-1.827-6.027c-.505-.53-1.097-.8-1.818-.8h-4.914v5.367h4.914c1.469 0 2.599-1.166 2.599-2.683 0-.73-.248-1.35-.776-1.879l-.005-.005Zm-1.818 4.867c1.644 0 2.899-1.31 2.899-2.983 0-.809-.279-1.506-.864-2.091-.558-.585-1.227-.892-2.035-.892h-5.214v5.966h5.214Zm2.575 3.502-.005-.005c-.527-.553-1.173-.827-1.957-.827h-5.527v5.729h5.527c1.582 0 2.795-1.251 2.795-2.879a2.75 2.75 0 0 0-.833-2.018Zm-7.789 5.197v-6.329h5.827c.864 0 1.589.307 2.175.92.613.613.92 1.366.92 2.23 0 1.785-1.339 3.179-3.095 3.179h-5.827Z"
          clipRule="evenodd"
        />
        <path d="M239.041 32.853a.89.89 0 0 1-1.254 0 .89.89 0 0 1 0-1.254.89.89 0 0 1 1.254 0 .889.889 0 0 1 0 1.254Zm2.753-7.187h2.904c1.003 0 1.839.355 2.508 1.055.679.7 1.013 1.567 1.013 2.6 0 1.035-.334 1.902-1.013 2.602-.669.7-1.505 1.055-2.508 1.055h-2.904v-7.313Zm1.442 5.933h1.462c.638 0 1.15-.209 1.547-.627.397-.428.595-.971.595-1.65 0-.68-.198-1.223-.595-1.64-.397-.429-.909-.637-1.547-.637h-1.462v4.554Zm8.753-1.64v1.64h3.082v1.379h-4.524v-7.313h4.471v1.38h-3.029V28.6h2.768v1.358h-2.768Zm8.997 3.019H259.2l-2.455-7.313h1.567l1.786 5.62 1.776-5.62h1.578l-2.466 7.313Z" />
      </g>
      <path
        fill="url(#markGradient)"
        d="M36.277 33.738a64.504 64.504 0 0 1-4.257 2.15c-6.333 2.912-15.383 5.86-26.228 5.981l-1.249.014-.226-1.228a31.016 31.016 0 0 1-.531-5.638C3.786 17.804 17.787 3.802 35 3.802a31.05 31.05 0 0 1 13.295 2.975l4.146-2.113A34.774 34.774 0 0 0 35 0C15.712 0 0 15.712 0 35c0 7.7 2.504 14.83 6.74 20.617 7.252-1.235 11.802-4.14 11.802-4.14s-2.905 4.544-4.14 11.798A34.803 34.803 0 0 0 35 70c19.288 0 35-15.712 35-35a34.778 34.778 0 0 0-4.652-17.42l-2.11 4.138a31.037 31.037 0 0 1 2.976 13.299C66.214 52.23 52.213 66.23 35 66.23c-1.942 0-3.804-.196-5.635-.53l-1.231-.225.014-1.251c.12-10.854 3.069-19.903 5.98-26.234a64.386 64.386 0 0 1 2.149-4.253Z"
      />
      <path
        fill="currentColor"
        d="m53.235 27.155-8.03-2.344-2.345-8.047L69.5.5 53.235 27.155Z"
      />
      <defs>
        <linearGradient
          id="markGradient"
          x1="49.496"
          x2="20.585"
          y1="20.504"
          y2="49.431"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4F75FF" />
          <stop offset="1" stopColor="#30AFFF" />
        </linearGradient>
      </defs>
    </svg>
  )
}
