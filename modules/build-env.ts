import { createResolver, defineNuxtModule } from '@nuxt/kit'
import { isCI } from 'std-env'
import { getEnv, version } from '../config/env'
import type { BuildInfo } from '~/types'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtModule({
  meta: {
    name: 'elk:build-env',
  },
  async setup(_options, nuxt) {
    const { env, commit, branch } = await getEnv()
    const buildInfo: BuildInfo = {
      version,
      time: +Date.now(),
      commit,
      branch,
      env,
    }

    nuxt.options.runtimeConfig.public.env = env
    nuxt.options.runtimeConfig.public.buildInfo = buildInfo

    nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || []
    if (env === 'dev')
      nuxt.options.nitro.publicAssets.unshift({ dir: resolve('../public-dev') })
    else if (env === 'canary' || env === 'preview' || !isCI)
      nuxt.options.nitro.publicAssets.unshift({ dir: resolve('../public-staging') })
  },
})
