import {NextApiRequest, NextApiResponse} from 'next'
import {sanityClient} from 'utils/sanity-client'
import {sanityAlgolia} from 'utils/algolia'
import {setupHttpTracing} from '@vercel/tracing-js'
import {withSentry} from '@sentry/nextjs'
import {tracer} from 'utils/honeycomb-tracer'
import get from 'lodash/get'

const secret = process.env.NEXT_PUBLIC_ALGOLIA_API_WRITE_KEY as string

export const addAllRecords = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  setupHttpTracing({
    name: addAllRecords.name,
    tracer,
    req,
    res,
  })
  // Basic security to prevent others from hitting this API
  const s = get(req.query, 's')
  if (s !== secret) {
    res.status(401).json({success: false, message: 'Invalid signature'})
    return
  }

  // Fetch the _id of all the documents we want to index
  const types = ['section', 'lesson']
  const query = `* [_type in $types][]._id`

  await sanityClient
    .fetch(query, {types})
    .then((ids) => {
      sanityAlgolia.webhookSync(sanityClient, {
        ids: {created: ids, updated: [], deleted: []},
      })
    })
    .then(() => {
      res.status(200).send('Success!')
    })
    .catch((err) => {
      res.status(500).send(`Something went wrong! ${err}`)
    })
}

export default withSentry(addAllRecords)
