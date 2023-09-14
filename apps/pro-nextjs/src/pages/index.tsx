import Layout from '@/components/app/layout'
import type {NextPage} from 'next'
import LandingCopy from '@/components/landing-copy.mdx'
import {PrimaryNewsletterCta} from '@/components/primary-newsletter-cta'
import Balancer from 'react-wrap-balancer'
import React from 'react'
import JackImage from '../../public/jack-herrington.jpg'
import Image from 'next/image'
import common from '@/text/common'

const Home: NextPage = () => {
  return (
    <Layout
      className="overflow-x-hidden"
      navigationProps={{
        className: 'absolute left-0 top-0 h-48 w-full',
      }}
    >
      <Header />
      <main>
        <article className="prose mx-auto w-full max-w-2xl px-5 md:prose-lg">
          <LandingCopy />
        </article>
        <div className="px-2 pt-10 sm:px-5 sm:pt-20">
          <PrimaryNewsletterCta />
        </div>
        <AboutJack />
      </main>
    </Layout>
  )
}

const AboutJack: React.FC<{title?: string; className?: string}> = ({
  title = 'Meet Your Instructor: Jack Herrington',
}) => {
  return (
    <section
      className={
        'mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-10 px-5 pb-5 pt-5 sm:gap-10 sm:pb-24 sm:pt-24 md:flex-row'
      }
    >
      <Image
        src={JackImage}
        width={200}
        height={200}
        priority
        placeholder="blur"
        alt="Jack Herrington"
        className="aspect-square rounded-full"
      />
      <div className="text-center sm:text-left">
        <p className="pb-3 text-xl font-medium">{title}</p>
        <p className="text-gray-600 sm:text-lg sm:leading-relaxed">
          {common['about-instructor']}
        </p>
      </div>
    </section>
  )
}

export default Home

const Header = () => {
  return (
    <header className="relative mx-auto flex w-full flex-col-reverse items-center justify-center gap-10 px-5 py-[15vh] sm:px-10 md:flex-row md:gap-24 lg:px-16">
      <div className="max-w-screen-xl whitespace-nowrap md:pb-16 lg:-mr-20">
        <h1 className="max-w-lg text-center text-3xl font-medium sm:text-4xl sm:leading-tight md:text-left lg:text-[2.7rem] lg:leading-tight">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            The <i>No-BS</i> Solution
          </span>{' '}
          <br />
          for Enterprise-Ready <br />
          Next.js Applications
        </h1>
        <div className="mt-4 flex items-center justify-center gap-2 text-gray-600 md:justify-start">
          With{' '}
          <Image
            src={JackImage}
            width={40}
            height={40}
            priority
            placeholder="blur"
            alt="Jack Herrington"
            className="aspect-square rounded-full"
          />
          <span>Jack Herrington</span>
        </div>
      </div>
      <div className="relative z-10">
        <Image
          src={require('../../public/hero.png')}
          className="relative z-10"
          width={2548 / 4}
          height={2549 / 4}
          alt=""
          aria-hidden
          quality={100}
          priority
          placeholder="blur"
        />
        <Image
          src={require('../../public/hero-shadow.png')}
          className="absolute right-0 top-0 mix-blend-multiply"
          width={2548 / 4}
          height={2548 / 4}
          alt=""
          aria-hidden
          quality={100}
          priority
          placeholder="blur"
        />
        <div className="absolute right-0 top-0 -z-10 flex h-[85%] w-[48%] items-end justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-[#3E75FE]  to-purple-400">
          <Image
            src={require('../../public/grid.png')}
            // fill
            className="absolute mb-10 scale-[2.1] opacity-10 mix-blend-overlay lg:mb-14"
            width={2744}
            height={1041}
            alt=""
            aria-hidden
            quality={100}
            priority
            placeholder="blur"
          />
        </div>
      </div>
      <svg
        className="absolute right-[-50%] top-[-40%] h-[120vh] w-full text-gray-100"
        viewBox="0 0 835 934"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.9414 293.029L357 892.474C371.593 917.797 398.787 933.525 427.976 933.525H513.692L53.8014 136.559L10.9414 210.931C-3.64713 236.246 -3.64713 267.705 10.9414 293.029Z"
          fill="currentColor"
        />
        <path
          d="M823.21 640.5L477.152 41.0556C462.555 15.7318 435.361 -1.14441e-05 406.175 -1.14441e-05H320.459L780.35 796.966L823.21 722.599C837.803 697.279 837.803 665.82 823.21 640.5Z"
          fill="currentColor"
        />
        <path
          d="M769.268 816.003C758.398 821.823 746.287 824.864 733.782 824.864C706.919 824.864 681.867 810.375 668.406 787.055L234.578 35.3861C221.808 13.2288 198.941 -1.14441e-05 173.398 -1.14441e-05C147.86 -1.14441e-05 124.988 13.2288 112.219 35.3861L64.8855 117.523C75.7598 111.702 87.8708 108.661 100.372 108.661C127.235 108.661 152.287 123.15 165.747 146.475L599.572 898.143C612.341 920.301 635.213 933.529 660.751 933.529C686.29 933.529 709.162 920.301 721.931 898.143L769.268 816.003Z"
          fill="currentColor"
        />
      </svg>
    </header>
  )
}
