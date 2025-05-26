export const c = {
  get: async function(cacheName: string, request: RequestInfo | URL) {
    const cache = await caches.open(cacheName);
    const hit = await cache.match(request);
    return { cache, hit };
  },
  put: async function(cache: Cache, request: RequestInfo | URL, response: Response) {
    return await cache.put(request, response.clone());
  },
  fetch: async function(cacheName: string, url: string, ctx: ExecutionContext) {
    const { cache, hit } = await this.get(cacheName, url);
    if (hit) {
      console.log(`[HIT] ${cacheName}`);
      return hit;
    }
    console.log(`[MISS] ${cacheName}`);
    const response = await fetch(url);
    
    if (response.ok) {
      ctx.waitUntil(this.put(cache, url, response.clone()));
    }
  
    return response;
  }
}