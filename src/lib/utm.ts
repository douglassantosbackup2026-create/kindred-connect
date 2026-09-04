const UTM_KEY = "jogador-pro-utm-v1";
const UTM_FIRST_KEY = "jogador-pro-utm-first-v1";
export const UTM_FIRST_TOUCH_MS = 90 * 24 * 60 * 60 * 1000;

export type UtmParams = {
  utm_source?: string | undefined;
  utm_medium?: string | undefined;
  utm_campaign?: string | undefined;
  utm_content?: string | undefined;
  utm_term?: string | undefined;
};

type FirstTouch = { at: number; utm: UtmParams };

function temUtm(utm: UtmParams): boolean {
  return Object.values(utm).some(Boolean);
}

function lerSession(): UtmParams {
  try {
    const raw = sessionStorage.getItem(UTM_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as UtmParams;
    return temUtm(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function lerFirstTouch(now = Date.now()): UtmParams {
  try {
    const raw = localStorage.getItem(UTM_FIRST_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as FirstTouch;
    if (!parsed?.at || !parsed.utm || now - parsed.at > UTM_FIRST_TOUCH_MS) {
      localStorage.removeItem(UTM_FIRST_KEY);
      return {};
    }
    return temUtm(parsed.utm) ? parsed.utm : {};
  } catch {
    return {};
  }
}

function gravarFirstTouch(utm: UtmParams, now = Date.now()) {
  if (!temUtm(utm)) return;
  if (temUtm(lerFirstTouch(now))) return;
  try {
    localStorage.setItem(UTM_FIRST_KEY, JSON.stringify({ at: now, utm } satisfies FirstTouch));
  } catch {
    /* ignore */
  }
}

export function captureUtmFromSearch(search: URLSearchParams | Record<string, unknown>) {
  const get = (k: string) => {
    if (search instanceof URLSearchParams) return search.get(k) ?? undefined;
    const v = search[k];
    return typeof v === "string" ? v : undefined;
  };

  const next: UtmParams = {};
  const source = get("utm_source");
  const medium = get("utm_medium");
  const campaign = get("utm_campaign");
  const content = get("utm_content");
  const term = get("utm_term");
  if (source) next.utm_source = source;
  if (medium) next.utm_medium = medium;
  if (campaign) next.utm_campaign = campaign;
  if (content) next.utm_content = content;
  if (term) next.utm_term = term;

  if (!temUtm(next)) return getStoredUtm();

  try {
    sessionStorage.setItem(UTM_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  gravarFirstTouch(next);
  return next;
}

export function getStoredUtm(): UtmParams {
  const sessao = lerSession();
  if (temUtm(sessao)) return sessao;
  return lerFirstTouch();
}

export function captureUtmFromLocation() {
  if (typeof window === "undefined") return {};
  return captureUtmFromSearch(new URLSearchParams(window.location.search));
}
