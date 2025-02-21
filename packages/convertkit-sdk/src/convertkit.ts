import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import {Cookie} from './cookie'
import fetch from 'node-fetch'
import {format} from 'date-fns'
import first from 'lodash/first'
import {z} from 'zod'
import {isNull, omitBy} from 'lodash'

const convertkitBaseUrl =
  process.env.CONVERTKIT_BASE_URL || 'https://api.convertkit.com/v3/'

const hour = 3600000
export const oneYear = 365 * 24 * hour

export function formatDate(date: Date) {
  return format(date, 'yyyy-MM-dd HH:mm:ss z')
}

const TagSubscriberResponseSchema = z.object({
  subscription: z.object({
    subscriber: z.object({
      id: z.coerce.string(),
      fields: z.record(z.string().nullable()).optional(),
    }),
  }),
})

export async function updateSubscriber(subscriber: {
  id: number
  email?: string
  first_name?: string
  fields: Record<string, string>
}) {
  const {first_name, email, fields} = subscriber
  return await fetch(`${convertkitBaseUrl}/subscribers/${subscriber.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      api_secret: process.env.CONVERTKIT_API_SECRET,
      first_name,
      email,
      fields,
    }),
  })
    .then((response) => response.json())
    .then(({subscriber}) => subscriber)
}

function deepOmitNull(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(deepOmitNull).filter((x) => x !== null)
  }

  if (obj && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const cleaned = deepOmitNull(value)
      if (cleaned !== null) {
        acc[key] = cleaned
      }
      return acc
    }, {} as Record<string, any>)
  }

  return obj === null ? undefined : obj
}

export function getConvertkitSubscriberCookie(subscriber: any): Cookie[] {
  return [
    {
      name: 'ck_subscriber',
      value: JSON.stringify(deepOmitNull(subscriber)),
      options: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        path: '/',
        maxAge: oneYear,
      },
    },
    {
      name:
        process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY || 'ck_subscriber_id',
      value: subscriber.id,
      options: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        path: '/',
        maxAge: 31556952,
      },
    },
  ]
}

export async function subscribeToEndpoint(
  endPoint: string,
  params: Record<string, any>,
) {
  return await fetch(`${convertkitBaseUrl}${endPoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      ...params,
      api_key:
        process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN ||
        process.env.CONVERTKIT_PUBLIC_TOKEN,
    }),
  })
    .then((res) => res.json())
    .then(({subscription}: {subscription: {subscriber: {id: number}}}) => {
      return subscription.subscriber
    })
}

export async function tagSubscriber(email: string, tagId: string) {
  const url = `${convertkitBaseUrl}/tags/${tagId}/subscribe`
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      email,
      api_key:
        process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN ||
        process.env.CONVERTKIT_PUBLIC_TOKEN,
    }),
  })
    .then((res) => {
      return res.ok ? res.json() : res.text()
    })
    .then((jsonRes: any) => {
      if (jsonRes === 'Retry Later') {
        throw new Error('convertkit-rate-limited')
      }
      const result = TagSubscriberResponseSchema.safeParse(jsonRes)
      if (!result.success) {
        console.error('CONVERTKIT_TAG_SUBSCRIBER_RESPONSE_ERROR', result.error)
        return undefined
      }
      return result.data.subscription.subscriber
    })
    .catch((e) => {
      console.error('CONVERTKIT_TAG_SUBSCRIBER_ERROR', e)
      return undefined
    })
}

export async function setConvertkitSubscriberFields(
  subscriber: {id: string | number; fields?: Record<string, string | null>},
  fields: Record<string, string>,
) {
  console.log('setConvertkitSubscriberFields', subscriber, fields)
  for (const field in fields) {
    await createConvertkitCustomField(field, subscriber)
  }
  return await fetch(`${convertkitBaseUrl}/subscribers/${subscriber.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      api_secret: process.env.CONVERTKIT_API_SECRET,
      fields,
    }),
  }).then((res) => res.json())
}

export async function createConvertkitCustomField(
  customField: string,
  subscriber: {fields?: Record<string, string | null>; id: string | number},
) {
  try {
    if (!process.env.CONVERTKIT_API_SECRET) {
      console.warn('set CONVERTKIT_API_SECRET')
      return
    }

    console.log('create fields subscriber', subscriber)
    console.log('create fields customField', customField)
    subscriber = await fetchSubscriber(subscriber.id)

    const fieldExists = subscriber?.fields
      ? !isEmpty(
          find(
            Object.keys(subscriber.fields),
            (field) => field === customField,
          ),
        )
      : false

    if (!fieldExists) {
      await fetch(`${convertkitBaseUrl}/custom_fields`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          api_secret: process.env.CONVERTKIT_API_SECRET,
          label: customField,
        }),
      })
    }
  } catch (e) {
    console.log({e})
    console.debug(`convertkit field not created: ${customField}`)
  }
}

export async function subscribeToTag(email: string, tagId: string) {
  if (
    !process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN &&
    !process.env.CONVERTKIT_PUBLIC_TOKEN
  ) {
    console.warn('set NEXT_PUBLIC_CONVERTKIT_TOKEN or CONVERTKIT_PUBLIC_TOKEN')
    return
  }
  await fetch(`${convertkitBaseUrl}/tags/${tagId}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      api_key:
        process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN ||
        process.env.CONVERTKIT_PUBLIC_TOKEN,
      email,
    }),
  })
}

export async function createConvertkitTag(name: string) {
  if (!process.env.CONVERTKIT_API_SECRET) {
    console.warn('set CONVERTKIT_API_SECRET')
    return null
  }

  try {
    const response = await fetch(`${convertkitBaseUrl}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        api_secret: process.env.CONVERTKIT_API_SECRET,
        name,
      }),
    })

    if (!response.ok) {
      console.error(`Failed to create tag: ${response.statusText}`)
      return null
    }

    const data = await response.json()
    console.log('Tag created successfully')
    return data
  } catch (error) {
    console.error('Error creating tag:', error)
    return null
  }
}

export async function subscribeToForm(options: {
  email: string
  first_name?: string
  formId: string
  fields?: Record<string, string>
}) {
  console.log('subscribing to form')

  if (
    !process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN &&
    !process.env.CONVERTKIT_PUBLIC_TOKEN
  ) {
    console.warn('set NEXT_PUBLIC_CONVERTKIT_TOKEN or CONVERTKIT_PUBLIC_TOKEN')
    return
  }

  return fetch(`${convertkitBaseUrl}/forms/${options.formId}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      api_key:
        process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN ||
        process.env.CONVERTKIT_PUBLIC_TOKEN,
      email: options.email,
      first_name: options.first_name,
      fields: options.fields,
    }),
  })
    .then((res) => res.json())
    .then(({subscription}: any) => {
      return subscription.subscriber
    })
}

export const getSubscriberByEmail = async <T = {email: string}>(
  email: string,
): Promise<T | undefined> => {
  const {subscribers} = await fetch(
    `${convertkitBaseUrl}/subscribers?email_address=${email}&api_secret=${process.env.CONVERTKIT_API_SECRET}`,
  ).then((response) => response.json())

  return first<T>(subscribers)
}

export async function fetchSubscriber(convertkitId: string | number) {
  if (!process.env.CONVERTKIT_API_SECRET) {
    console.warn('set CONVERTKIT_API_SECRET')
    return
  }

  let subscriber

  if (convertkitId) {
    const subscriberUrl = `${convertkitBaseUrl}/subscribers/${convertkitId}?api_secret=${process.env.CONVERTKIT_API_SECRET}`
    subscriber = await fetch(subscriberUrl)
      .then((res) => {
        return res.ok ? res.json() : res.text()
      })
      .then((res: any) => {
        if (res === 'Retry Later') {
          throw new Error('convertkit-rate-limited')
        }
        const subscriber = res.subscriber
        return subscriber
      })
      .catch((e) => {
        console.error('CONVERTKIT_FETCH_SUBSCRIBER_ERROR', e)
        return undefined
      })
  }

  if (isEmpty(subscriber)) return

  const tagsApiUrl = `${convertkitBaseUrl}/subscribers/${
    subscriber.id
  }/tags?api_key=${
    process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN ||
    process.env.CONVERTKIT_PUBLIC_TOKEN
  }`
  const tags = await fetch(tagsApiUrl).then((res) => res.json())

  return {...subscriber, tags}
}
