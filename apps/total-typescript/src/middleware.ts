import {NextRequest, NextResponse} from 'next/server'
import {withAuth} from 'next-auth/middleware'

import {
  getMiddlewareResponse,
  SITE_ROOT_PATH,
} from './server/get-middleware-response'

const PUBLIC_FILE = /\.(.*)$/

// The allow-list of paths where this middleware executes (perf)
export const config = {
  matcher: ['/', '/workshops/:module/:section/:lesson*'],
}

export default withAuth(
  async function middleware(req: NextRequest) {
    // think favicon etc as PUBLIC_FILE
    if (PUBLIC_FILE.test(req.nextUrl.pathname)) return NextResponse.next()

    return getMiddlewareResponse(req)
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
)
