import {
  CastingWordsOrderResponseSchema,
  getSRTText,
  getTranscriptText,
} from '@/lib/castingwords'
import {sanityWriteClient} from '@/utils/sanity-server'
import {z} from 'zod'
import {uniqueId} from 'lodash'
import first from 'lodash/first'
import groq from 'groq'
import Mux from '@mux/mux-node'

const VideoResourceSchema = z.object({
  _id: z.string(),
  originalMediaUrl: z.string(),
  castingwords: z
    .object({
      audioFileId: z.string().or(z.number()).optional(),
      orderId: z.string(),
      transcript: z.any().optional(),
      srt: z.string().optional(),
    })
    .nullish(),
  muxAsset: z
    .object({
      muxAssetId: z.string(),
      muxPlaybackId: z.string().optional(),
    })
    .nullish(),
  duration: z.number().optional(),
})

type VideoResource = z.infer<typeof VideoResourceSchema>

export const writeTranscriptToVideoResource = async (
  audiofile: string,
  order: string,
) => {
  const transcript = await getTranscriptText(audiofile)
  const {srt, srtUrl} = await getSRTText(audiofile)

  const getDocumentQuery = groq`*[_type == "videoResource" && castingwords.orderId == "${order}"][0]`

  const document: VideoResource = VideoResourceSchema.parse(
    await sanityWriteClient.fetch(getDocumentQuery),
  )

  const {_id, castingwords, muxAsset} = document
  let assetDuration = 0

  if (muxAsset) {
    const {Video} = new Mux()
    const {tracks, duration} = await Video.Assets.get(muxAsset.muxAssetId)

    assetDuration = duration || 0

    const existingSubtitle = tracks?.find(
      (track: any) => track.name === 'English',
    )

    if (!existingSubtitle) {
      await Video.Assets.createTrack(muxAsset.muxAssetId, {
        url: srtUrl,
        type: 'text',
        text_type: 'subtitles',
        closed_captions: false,
        language_code: 'en-US',
        name: 'English',
        passthrough: 'English',
      })
    }
  }

  return sanityWriteClient
    .patch(_id)
    .set({
      castingwords: {
        ...castingwords,
        // We've started using plain text instead of Portable Text for the transcript
        transcript: transcript,
        // This is a portable text version of the transcript
        // [
        //   {
        //     style: 'normal',
        //     _type: 'block',
        //     // TODO: Programmatically create an array of blocks for each paragraph break in the transcript
        //     // how does this format in Portable Text?
        //     children: [
        //       {
        //         _type: 'span',
        //         marks: [],
        //         _key: uniqueId('body-key-'),
        //         text: transcript,
        //       },
        //     ],
        //     markDefs: [],
        //     _key: uniqueId('block-key-'),
        //   },
        // ],
        srt: srt,
      },
    })
    .commit()
}

const UpdateVideoResourceAssetSchema = z.object({
  sanityDocumentId: z.string(),
  castingwordsOrder: CastingWordsOrderResponseSchema,
  muxAsset: z.object({
    muxAssetId: z.string(),
    muxPlaybackId: z.string().optional(),
  }),
  duration: z.number().optional(),
})

type UpdateVideoResourceAsset = z.infer<typeof UpdateVideoResourceAssetSchema>

export const updateVideoResourceWithTranscriptOrderId = async ({
  sanityDocumentId,
  castingwordsOrder,
  muxAsset,
  duration,
}: UpdateVideoResourceAsset) => {
  return sanityWriteClient
    .patch(sanityDocumentId)
    .set({
      duration,
      muxAsset,
      castingwords: {
        orderId: castingwordsOrder.order,
        audioFileId: String(first(castingwordsOrder.audiofiles)),
      },
    })
    .commit()
}
