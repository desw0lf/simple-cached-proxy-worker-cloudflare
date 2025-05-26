export const corsHeaders = (list?: null | string | string[]) => {
  let origin = "*";
  if (typeof list === "string") {
    origin = list;
  } else if (Array.isArray(list)) {
    origin = list.join(",");
  }
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS"
  };
}