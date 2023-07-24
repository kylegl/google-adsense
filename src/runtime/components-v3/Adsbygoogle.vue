<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { onMounted, useRoute, useRuntimeConfig, watchEffect } from '#imports'
import { adRegion, hasRouteChanged, showAd, updateAd } from '../utils/adsByGoogle'
import { CONFIG_KEY } from '../../config'

withDefaults(defineProps<{
  adClient?: string
  adSlot?: string
  adFormat?: string
  adLayout?: string
  adLayoutKey?: string
  adStyle?: Record<string, string>
  adFullWidthResponsive?: boolean
  pageUrl?: string
  analyticsUacct?: string
  analyticsDomainName?: string
  includeQuery?: boolean
}>(),
{
  adFormat: 'auto',
  adFullWidthResponsive: false,
  adStyle: () => ({ display: 'block' })
})

const config = useRuntimeConfig().public[CONFIG_KEY]
const options = {
  ...config,
  id: config.test ? 'ca-google' : config.id,
}

const ad = ref<HTMLElement | null>(null)
const show = ref(false)
const route = useRoute()

const isConnected = computed(() => ad.value?.isConnected || false)
const innerHtml = computed(() => show.value ? '' : ' ')
const key = computed(() => Math.random())

// update ad on route change
watch(route, (newRoute, oldRoute) => {
  if (!isConnected.value)
    return

  const routeChanged = hasRouteChanged(newRoute, oldRoute)

  if (!routeChanged)
    return

  updateAd(show)
}, { immediate: true })

watchEffect(() => {
  if (!show.value)
    return

  showAd(ad.value)
})

// show ad on client and connected
onMounted(() => {
  if (process.client && isConnected.value)
    show.value = true
})
</script>

<template>
  <ins
    ref="ad"
    :key="key"
    class="adsbygoogle"
    :style="adStyle"
    :data-ad-client="adClient || options.id"
    :data-ad-slot="adSlot || null"
    :data-ad-format="adFormat"
    :data-ad-region="show ? adRegion() : null"
    :data-ad-layout="adLayout || null"
    :data-ad-layout-key="adLayoutKey || null"
    :data-page-url="pageUrl || null"
    :data-analytics-uacct="analyticsUacct || options.analyticsUacct || null"
    :data-analytics-domain-name="analyticsDomainName || options.analyticsDomainName || null"
    :data-adtest="options.test ? 'on' : null"
    :data-adsbygoogle-status="show ? null : ''"
    :data-ad-full-width-responsive="adFullWidthResponsive"
  >
    {{ innerHtml }}
  </ins>
</template>
