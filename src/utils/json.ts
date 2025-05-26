import { corsHeaders } from "./cors";

export function json(data: any, init: ResponseInit = { status: 200 }, corsList?: null | string | string[]) {
  const isObj = typeof data === "object" && data !== null;
  const body = isObj && data.error && init.status ? { status: init.status, ...data } : data;
  const headers = init.headers || {};
  return new Response(isObj ? JSON.stringify(body) : body, {
    ...init,
    headers: { ...corsHeaders(corsList), "Content-Type": "application/json", ...headers }
  });
}