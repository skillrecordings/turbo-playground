// Next.js API route to check if user is a sponsor
import {NextApiRequest, NextApiResponse} from 'next'
import {init, track, Types} from '@amplitude/analytics-node'

init(process.env.AMPLITUDE_API_KEY as string, {
  logLevel: Types.LogLevel.Debug,
})

type TrackPayload = {
  event: string
  properties: any
  device: {
    device_id: string
  }
}

const trackRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  // Get track event and properties from request body
  const {event, properties, device}: TrackPayload = req.body
  console.debug(`track ${event}`, properties, device)
  track(event, properties, device)

  // Send back a 200 response
  res.status(200).json({status: 'ok'})
}

export default trackRoute
