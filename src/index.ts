import { c } from "./utils/cache";
import { json } from "./utils/json";
import { buildCacheParams } from "./build-cache-params";

export default {
	async fetch(request, env, ctx): Promise<Response> {
    // --> /anything/anything
    const pattern = new URLPattern({
      pathname: "/:pathname+",
    });

    const { key, baseUrl, allowedParams } = {
      key: env.KEY || "stuff",
      baseUrl: env.BASE_URL.startsWith("http") ? env.BASE_URL : `https://${env.BASE_URL}`,
      allowedParams: env.ALLOWED_SEARCH || "" // "w=__any&h=__any&fit=max|crop&auto=format&q=100&blur=10"
    };

    const url = new URL(request.url);

    const match = pattern.exec(url);

    if (!match || !match.pathname.groups.pathname) {
      return json({ error: "Not found" }, { status: 404 });
    }

    const cacheParams = buildCacheParams(url.searchParams, allowedParams);
    const search = cacheParams.size > 0 ? "?" + cacheParams.toString() : "";

    const targetUrl = new URL(baseUrl + url.pathname + search);
    // console.log("Original", url.search)
    // console.log("Transformed", targetUrl.search);

    const response = await c.fetch(key, targetUrl.href, ctx);

    return response;
	},
} satisfies ExportedHandler<Env>;
