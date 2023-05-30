import remarkShikiTwoslash, {
  type Options as RemarkShikiTwoslashOptions,
} from 'remark-shiki-twoslash'
import {remarkCodeHike} from '@code-hike/mdx'
import {type MDXRemoteSerializeResult} from 'next-mdx-remote'
// import {SerializeOptions} from 'next-mdx-remote/dist/types'
import {serialize} from 'next-mdx-remote/serialize'
import defaultTheme from 'shiki/themes/github-dark.json'
import rehypeRaw from 'rehype-raw'
import {nodeTypes} from '@mdx-js/mdx'

/**
 * Serialize MDX with next-mdx-remote. Uses remark-code-hike for syntax highlighting.
 * @param {string} text - The text to serialize
 * @param {boolean} useShikiTwoslash - Whether to use remark-shiki-twoslash instead of remark-code-hike, defaults to `false`
 * @param {SyntaxHighlighterOptions} syntaxHighlighterOptions - The options to pass to the remarkCodeHike or remarkShikiTwoslash plugin
 * @param {ShikiTheme} options.theme - The theme to use for syntax highlighting, defaults to `github-dark`
 * @param {boolean} options.lineNumbers - Whether to render line numbers, defaults to `false`
 * @param {boolean} options.showCopyButton - Whether to render a copy button, defaults to `false`
 * @param {scope} options.scope - Pass-through variables for use in the MDX content
 * @see themes https://github.com/shikijs/shiki/blob/main/docs/themes.md
 * @returns {Promise<MDXRemoteSerializeResult>} The serialized MDX
 * @example
 * const mdx = await serializeMDX('# Hello World')
 * // <h1>Hello World</h1>
 * @example
 * const mdx = await serializeMDX('# Hello World', {theme: 'github-light', lineNumbers: true, showCopyButton: true})
 */

type RemarkCodeHikePluginOptions = {
  theme?: ShikiTheme
  lineNumbers?: boolean
  showCopyButton?: boolean
  autoImport?: boolean
}

type RemarkShikiTwoslashPluginOptions = {
  theme?: ShikiTheme
} & RemarkShikiTwoslashOptions

type SerializeMDXProps = {
  scope?: Record<string, unknown>
  useShikiTwoslash?: boolean
  syntaxHighlighterOptions?: SyntaxHighlighterOptions
}

type SyntaxHighlighterOptions =
  | RemarkCodeHikePluginOptions
  | Omit<RemarkShikiTwoslashPluginOptions, 'langs'>

const serializeMDX = async (
  text: string,
  {scope, syntaxHighlighterOptions, useShikiTwoslash}: SerializeMDXProps = {},
): Promise<MDXRemoteSerializeResult> => {
  const {theme} = syntaxHighlighterOptions || {}

  if (useShikiTwoslash) {
    const mdxContent = await serialize(text, {
      scope,
      mdxOptions: {
        useDynamicImport: true,
        rehypePlugins: [[rehypeRaw, {passThrough: nodeTypes}]],
        remarkPlugins: [
          [
            remarkShikiTwoslash,
            {
              ...syntaxHighlighterOptions,
              theme: theme
                ? require(`shiki/themes/${theme}.json`)
                : defaultTheme,
              langs: [
                require('./shiki-langs/tsx.tmLanguage.json'),
                require('./shiki-langs/typescript.tmLanguage.json'),
                require('./shiki-langs/javascript.tmLanguage.json'),
                require('./shiki-langs/jsx.tmLanguage.json'),
                require('./shiki-langs/json.tmLanguage.json'),
              ],
            } satisfies RemarkShikiTwoslashPluginOptions,
          ],
        ],
      },
    })
    return mdxContent
  } else {
    const lineNumbers =
      syntaxHighlighterOptions && 'lineNumbers' in syntaxHighlighterOptions
        ? syntaxHighlighterOptions.lineNumbers
        : false

    const showCopyButton =
      syntaxHighlighterOptions && 'showCopyButton' in syntaxHighlighterOptions
        ? syntaxHighlighterOptions.showCopyButton
        : false
    const mdxContent = await serialize(text, {
      scope,
      mdxOptions: {
        useDynamicImport: true,
        remarkPlugins: [
          [
            remarkCodeHike,
            {
              theme: theme
                ? require(`shiki/themes/${theme}.json`)
                : defaultTheme,
              autoImport: false,
              lineNumbers,
              showCopyButton,
              // ...syntaxHighlighterOptions,
            } satisfies RemarkCodeHikePluginOptions,
          ],
        ],
      },
    })
    return mdxContent
  }
}

export default serializeMDX

type ShikiTheme =
  | 'css-variables'
  | 'dark-plus'
  | 'dracula-soft'
  | 'dracula'
  | 'github-dark-dimmed'
  | 'github-dark'
  | 'github-light'
  | 'hc_light'
  | 'light-plus'
  | 'material-theme-darker'
  | 'material-theme-lighter'
  | 'material-theme-ocean'
  | 'material-theme-palenight'
  | 'material-theme'
  | 'min-dark'
  | 'min-light'
  | 'monokai'
  | 'nord'
  | 'one-dark-pro'
  | 'poimandres'
  | 'rose-pine-dawn'
  | 'rose-pine-moon'
  | 'rose-pine'
  | 'slack-dark'
  | 'slack-ochin'
  | 'solarized-dark'
  | 'solarized-light'
  | 'vitesse-dark'
  | 'vitesse-light'
