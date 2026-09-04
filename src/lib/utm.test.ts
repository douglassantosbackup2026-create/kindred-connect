import { afterEach, describe, expect, it } from "vitest";
import { captureUtmFromSearch, getStoredUtm, lerFirstTouch, UTM_FIRST_TOUCH_MS } from "./utm";

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => {
      data.set(k, v);
    },
    removeItem: (k: string) => {
      data.delete(k);
    },
    clear: () => data.clear(),
    get length() {
      return data.size;
    },
    key: (i: number) => [...data.keys()][i] ?? null,
  };
}

function instalarStorage() {
  const session = memoryStorage();
  const local = memoryStorage();
  Object.defineProperty(globalThis, "sessionStorage", { value: session, configurable: true });
  Object.defineProperty(globalThis, "localStorage", { value: local, configurable: true });
  return { session, local };
}

afterEach(() => {
  Reflect.deleteProperty(globalThis, "sessionStorage");
  Reflect.deleteProperty(globalThis, "localStorage");
});

describe("utm first-touch", () => {
  it("grava first-touch no localStorage e last-touch na sessão", () => {
    instalarStorage();
    const utm = captureUtmFromSearch({
      utm_source: "facebook",
      utm_medium: "cpc",
      utm_campaign: "prospeccao",
    });
    expect(utm.utm_source).toBe("facebook");
    expect(getStoredUtm().utm_campaign).toBe("prospeccao");
    expect(lerFirstTouch().utm_source).toBe("facebook");
  });

  it("não sobrescreve first-touch se já existir", () => {
    instalarStorage();
    captureUtmFromSearch({ utm_source: "facebook", utm_campaign: "primeiro" });
    captureUtmFromSearch({ utm_source: "instagram", utm_campaign: "segundo" });
    expect(lerFirstTouch().utm_campaign).toBe("primeiro");
    expect(getStoredUtm().utm_campaign).toBe("segundo");
  });

  it("usa first-touch quando a sessão acabou", () => {
    const { session } = instalarStorage();
    captureUtmFromSearch({ utm_source: "facebook", utm_campaign: "ads" });
    session.clear();
    expect(getStoredUtm()).toEqual({ utm_source: "facebook", utm_campaign: "ads" });
  });

  it("descarta first-touch depois de 90 dias", () => {
    const { local } = instalarStorage();
    local.setItem(
      "jogador-pro-utm-first-v1",
      JSON.stringify({
        at: Date.now() - UTM_FIRST_TOUCH_MS - 1000,
        utm: { utm_source: "facebook" },
      }),
    );
    expect(lerFirstTouch()).toEqual({});
    expect(getStoredUtm()).toEqual({});
  });
});
