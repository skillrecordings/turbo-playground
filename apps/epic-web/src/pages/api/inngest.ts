import {serve} from 'inngest/next'
import {inngest} from 'inngest/inngest.server'
import {processNewTip} from 'inngest/functions/tips/process-new-tip'
import {addSrtToMuxAsset} from 'inngest/functions/tips/add-srt-to-mux-asset'
import {stripeCheckoutCompleted} from 'inngest/functions/stripe/checkout-completed'
import {lessonCompleted} from 'inngest/functions/progress/lesson-completed'
import {inactivityAfterPurchase} from 'inngest/functions/progress/inactivity-after-purchase'
import {resumeProgressAfterInactivity} from 'inngest/functions/progress/resume-progress'

export default serve({
  client: inngest,
  functions: [
    processNewTip,
    addSrtToMuxAsset,
    stripeCheckoutCompleted,
    inactivityAfterPurchase,
    lessonCompleted,
    resumeProgressAfterInactivity,
  ],
})
