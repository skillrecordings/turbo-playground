import {ModuleProgress} from '@skillrecordings/skill-lesson/video/module-progress'

export const EMAIL_WRITING_REQUESTED_EVENT = 'email/writing-requested'

export type EmailWritingRequested = {
  name: typeof EMAIL_WRITING_REQUESTED_EVENT
  data: {
    name: string
    email: string
    moduleProgress: ModuleProgress
    currentModuleSlug: string
    currentLessonSlug: string
    additionalContext: string
  }
}

export const TIP_VIDEO_UPLOADED_EVENT = 'tip/video.uploaded'

export type NewTipVideo = {
  name: typeof TIP_VIDEO_UPLOADED_EVENT
  data: {
    tipId: string
    videoResourceId: string
  }
}

export const TIP_VIDEO_TRANSCRIPT_CREATED_EVENT = 'tip/video.transcript.created'
export type TranscriptCreatedEvent = {
  name: typeof TIP_VIDEO_TRANSCRIPT_CREATED_EVENT
  data: {
    transcript: {
      text: string
      srt: string
    }
    videoResourceId: string
  }
}

export const TIP_VIDEO_SRT_READY_EVENT = 'tip/video.srt.ready'

export type SRTReadyEvent = {
  name: typeof TIP_VIDEO_SRT_READY_EVENT
  data: {
    srt: string
    muxAssetId: string
    videoResourceId: string
  }
}

export const TIP_VIDEO_LLM_SUGGESTIONS_CREATED_EVENT =
  'tip/video.llm.suggestions.created'

export type LLMSuggestionsCreated = {
  name: typeof TIP_VIDEO_LLM_SUGGESTIONS_CREATED_EVENT
  data: {
    llmSuggestions: any
    videoResourceId: string
  }
}
