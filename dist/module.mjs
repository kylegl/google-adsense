import { defineNuxtModule, createResolver, logger, addImports, addComponent } from '@nuxt/kit';

function isObject(value) {
  return value !== null && typeof value === "object";
}
function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isObject(value) && isObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();

const TEST_ID = "ca-google";
const ADSENSE_URL = "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";

function initializeAdClient(options) {
  const adsenseScript = `{
        google_ad_client: "${options.id}",
        overlays: {bottom: ${options.overlayBottom}},
        ${options.pageLevelAds ? "enable_page_level_ads: true" : ""}
      }`;
  if (!options.onPageLoad)
    return createScriptMeta(
      `adsbygoogle.pauseAdRequests=${options.pauseOnLoad ? "1" : "0"};
      adsbygoogle.push(${adsenseScript});`
    );
  return createScriptMeta(
    `adsbygoogle.onload = function() {
      adsbygoogle.pauseAdRequests=${options.pauseOnLoad ? "1" : "0"};
      [].forEach.call(document.getElementsByClassName('adsbygoogle'), function() { adsbygoogle.push(${adsenseScript}); })
    };`
  );
}
function createScriptMeta(script) {
  script = `(window.adsbygoogle = window.adsbygoogle || []); ${script}`;
  script = `if (!window.__abg_called){ ${script} window.__abg_called = true;}`;
  return {
    hid: "adsbygoogle",
    innerHTML: script
  };
}

const module = defineNuxtModule({
  meta: {
    name: "@nuxtjs/google-adsense",
    configKey: "googleAdsense",
    compatibility: {
      nuxt: "^3.X.X"
    }
  },
  defaults: (nuxt) => ({
    id: TEST_ID,
    tag: "adsbygoogle",
    pageLevelAds: false,
    includeQuery: false,
    analyticsUacct: "",
    analyticsDomainName: "",
    overlayBottom: false,
    test: nuxt.options.dev && process.env.NODE_ENV !== "production",
    onPageLoad: false,
    pauseOnLoad: false
  }),
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    if (options.test)
      logger.info("Test mode enabled - Using Test AdSense ID");
    else if (options.id === TEST_ID || typeof options.id !== "string") {
      logger.warn("Invalid AdSense client ID specified");
      return;
    }
    const head = nuxt.options.app.head;
    head.script = head.script ?? [];
    head.script.push({
      hid: "adsbygoogle-script",
      defer: true,
      crossorigin: "anonymous",
      src: `${ADSENSE_URL}?client=${options.id}`
    });
    const scriptMeta = initializeAdClient(options);
    head.script.push(scriptMeta);
    if (options.test) {
      head.meta = head.meta ?? [];
      head.meta.unshift({
        name: "robots",
        content: "noindex,noarchive,nofollow"
      });
    }
    addImports({
      name: "useAdsense",
      as: "useAdsense",
      from: resolve("runtime/composables/adsense")
    });
    addComponent({
      name: "Adsbygoogle",
      filePath: resolve("runtime/components/Adsbygoogle.vue")
    });
    nuxt.options.runtimeConfig.public.googleAdsense = defu(
      //@ts-ignore
      nuxt.options.runtimeConfig.public.googleAdsense,
      options
    );
  }
});

export { module as default };
