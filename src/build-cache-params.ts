let cachedRules: Map<string, string[]> | null = null;
let cachedRulesKey: string | null = null;

function parseAllowedParams(allowedParamsStr: string): Map<string, string[]> {
  if (cachedRules && cachedRulesKey === allowedParamsStr) {
    return cachedRules;
  }

  const rules = new Map<string, string[]>();
  const paramRules = allowedParamsStr.split("&");
  
  for (const rule of paramRules) {
    const [param, values] = rule.split("=", 2);
    if (!param || !values) continue;
    
    const allowedValues = values.split("|").map(v => v.trim());
    rules.set(param.trim(), allowedValues);
  }
  
  cachedRules = rules;
  cachedRulesKey = allowedParamsStr;
  
  return rules;
}

export function buildCacheParams(searchParams: URLSearchParams, allowedParamsStr: string): URLSearchParams {
  if (!allowedParamsStr) {
    return searchParams;
  }

  const rules = parseAllowedParams(allowedParamsStr);
  const cacheParams = new URLSearchParams();

  for (const [param, allowedValues] of rules) {
    const actualValue = searchParams.get(param);
    
    if (actualValue !== null) {
      const isValidValue = allowedValues.some((allowedValue) => {
        if (allowedValue === "__any") {
          return true;
        }
        return allowedValue === actualValue;
      });
      
      if (isValidValue) {
        cacheParams.set(param, actualValue);
      }
    }
  }

  cacheParams.sort();
  return cacheParams;
}