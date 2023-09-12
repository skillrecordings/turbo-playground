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
    NEXT_PUBLIC_SUPPORT_EMAIL: string
    CONVERTKIT_BASE_URL: string
    NEXT_PUBLIC_GOOGLE_ANALYTICS: string
    NEXT_PUBLIC_DEFAULT_OG_IMAGE_URL: string
    EMAIL_SERVER_HOST: string
    EMAIL_SERVER_PORT: number
    POSTMARK_KEY: string
    NEXT_PUBLIC_PRODUCT_NAME: string
    STRIPE_SECRET_TOKEN: string
    CASTINGWORDS_API_TOKEN: string
    SANITY_WEBHOOK_SECRET: string
    GITHUB_SECRET: string
    GITHUB_ID: string
    DISCORD_CLIENT_ID: string
    DISCORD_CLIENT_SECRET: string
  }
}
