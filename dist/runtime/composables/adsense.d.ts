import { RouteLocationNormalizedLoaded } from 'vue-router';
import { Ref } from 'vue';
export interface AdsByGoogleWindow extends Window {
    adsbygoogle: unknown[];
}
export declare let window: AdsByGoogleWindow;
export declare function useAdsense(ad: Ref<HTMLElement | null>): {
    generateAdRegion: () => string;
    hasRouteChanged: (newRoute: RouteLocationNormalizedLoaded, oldRoute?: RouteLocationNormalizedLoaded) => boolean;
    innerHtml: import("vue").ComputedRef<"" | " ">;
    key: import("vue").ComputedRef<number>;
    show: Ref<boolean>;
    updateAd: () => Promise<void>;
};
