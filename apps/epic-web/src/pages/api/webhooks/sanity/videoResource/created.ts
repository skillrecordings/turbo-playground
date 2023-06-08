import {withSentry} from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import {updateVideoResourceWithTranscriptOrderId} from 'lib/sanity'
import * as Sentry from '@sentry/nextjs'
import {createCastingWordsOrder} from '@skillrecordings/skill-lesson/lib/casting-words'
import {createMuxAsset} from '@skillrecordings/skill-lesson/lib/mux'

const secret = process.env.SANITY_WEBHOOK_SECRET

/**
 * link to webhook {@link} https://www.sanity.io/organizations/om9qNpcXE/project/z9io1e0u/api/webhooks/xV5ZY6656qclI76i
 *
 * @param req
 * @param res
 */
const sanityVideoResourceWebhook = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const signature = req.headers[SIGNATURE_HEADER_NAME] as string
  const isValid = isValidSignature(JSON.stringify(req.body), signature, secret)

  try {
    if (isValid) {
      const {_id, originalMediaUrl, castingwords, muxAsset, duration} = req.body
      console.info('processing Sanity webhook: Video Resource created', _id)

      const castingwordsOrder = await createCastingWordsOrder({
        originalMediaUrl,
        castingwords,
      })

      const {duration: assetDuration, ...newMuxAsset} = await createMuxAsset({
        originalMediaUrl,
        muxAsset,
        duration,
      })

      await updateVideoResourceWithTranscriptOrderId({
        sanityDocumentId: _id,
        castingwordsOrder,
        muxAsset: newMuxAsset,
        duration: assetDuration,
      })
      res.status(200).json({success: true})
    } else {
      res.status(500).json({success: false})
    }
  } catch (e) {
    Sentry.captureException(e)
    res.status(200).json({success: true})
  }
}

export default withSentry(sanityVideoResourceWebhook)

export const config = {
  api: {
    externalResolver: true,
  },
}
