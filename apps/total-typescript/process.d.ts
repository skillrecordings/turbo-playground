declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string
    NEXT_PUBLIC_SITE_TITLE: string
    NEXT_PUBLIC_URL: string
    NEXT_PUBLIC_PARTNER_FIRST_NAME: string
    NEXT_PUBLIC_PARTNER_LAST_NAME: string
    NEXT_PUBLIC_PARTNER_TWITTER: string
    NEXT_PUBLIC_SEO_KEYWORDS: string
    NEXT_PUBLIC_PRODUCT_DESCRIPTION: string
    NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM: string
    NEXT_PUBLIC_CONVERTKIT_TOKEN: string
    NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY: string
    CONVERTKIT_BASE_URL: string
    NEXT_PUBLIC_GOOGLE_ANALYTICS: string
    EMAIL_SERVER_PORT: number
    NEXT_PUBLIC_AMPLITUDE_API_KEY: string
    SANITY_WEBHOOK_SECRET: string
    CASTINGWORDS_API_TOKEN: string
    MUX_TOKEN_ID: string
    MUX_TOKEN_SECRET: string
    NEXT_PUBLIC_DISCORD_INVITE_URL: string
    SLACK_ANNOUNCE_CHANNEL_ID: string
    SLACK_FEEDBACK_CHANNEL_ID: string
    SLACK_TOKEN: string
    GITHUB_ID: string
    GITHUB_SECRET: string
  }
}
