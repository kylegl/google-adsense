
import { ModuleOptions } from './module'

declare module '@nuxt/schema' {
  interface NuxtConfig { ['googleAdsense']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['googleAdsense']?: ModuleOptions }
}

declare module 'nuxt/schema' {
  interface NuxtConfig { ['googleAdsense']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['googleAdsense']?: ModuleOptions }
}


export { ModuleOptions, default } from './module'
