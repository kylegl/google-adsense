import { computed, ref } from "vue";
export function useAdsense(ad) {
  const innerHtml = computed(() => show.value ? "" : " ");
  const key = computed(() => Math.random());
  const show = ref(true);
  function hasRouteChanged(newRoute, oldRoute) {
    if (newRoute.path !== oldRoute?.path)
      return true;
    const newQueryKeys = Object.keys(newRoute.query);
    const oldQueryKeys = Object.keys(oldRoute.query);
    return newQueryKeys.length !== oldQueryKeys.length || newQueryKeys.some((key2) => newRoute.query[key2] !== oldRoute.query[key2]);
  }
  async function updateAd() {
    if (process.server)
      return;
    setTimeout(() => {
      if (ad.value?.innerHTML)
        return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error(error);
      }
    }, 50);
  }
  function generateAdRegion() {
    return `page-${Math.random()}`;
  }
  return {
    generateAdRegion,
    hasRouteChanged,
    innerHtml,
    key,
    show,
    updateAd
  };
}
