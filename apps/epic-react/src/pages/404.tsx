import Image from 'next/image'

import Layout from '@/components/app/layout'

export default function Custom404() {
  return (
    <Layout meta={{title: 'Not Found'}}>
      <main className="absolute left-0 top-0 mx-auto flex min-h-screen w-full max-w-full flex-col justify-center text-white">
        <Image
          src="/assets/sky@2x.jpg"
          alt="a lost cosmonaut"
          fill
          className="object-cover"
        />
        <div className="absolute top-0 z-10 flex min-h-screen w-full flex-col items-center justify-center">
          <div className="w-28">
            <Image
              src="/assets/cosmonaut@2x.png"
              alt="a lost cosmonaut"
              width={700}
              height={700}
            />
          </div>
          <div className="pt-3 text-xl font-light opacity-25">404</div>
          <h1 className="pt-10 text-2xl font-semibold">Not Found</h1>
        </div>
      </main>
    </Layout>
  )
}
