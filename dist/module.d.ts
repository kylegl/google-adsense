import * as _nuxt_schema from '@nuxt/schema';

interface ModuleOptions {
    tag?: string;
    id?: string;
    analyticsUacct?: string;
    analyticsDomainName?: string;
    pageLevelAds?: boolean;
    includeQuery?: boolean;
    overlayBottom?: boolean;
    onPageLoad?: boolean;
    pauseOnLoad?: boolean;
    test?: boolean;
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions>;

export { ModuleOptions, _default as default };
