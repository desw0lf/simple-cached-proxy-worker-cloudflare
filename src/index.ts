import { c } from "./utils/cache";
import { json } from "./utils/json";
import { buildCacheParams } from "./build-cache-params";

export default {
	async fetch(request, env, ctx): Promise<Response> {
    // --> /anything/anything
    const pattern = new URLPattern({
      pathname: "/:pathname+",
    });

    const { key, baseUrl, allowedParams, stripHeaders } = {
      key: env.KEY || "stuff",
      stripHeaders: env.STRIP_HEADERS ? env.STRIP_HEADERS.split(",") : [],
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

    if (stripHeaders.length === 0) {
      return response;
    }

    const originalHeaders = new Headers(response.headers);

    stripHeaders.forEach((header) => originalHeaders.delete(header));

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: originalHeaders,
    });
	},
} satisfies ExportedHandler<Env>;
