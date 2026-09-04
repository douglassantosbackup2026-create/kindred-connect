import { describe, expect, it, vi, afterEach } from "vitest";
import { fbcCookieAttrs, montarFbc, lembrarInitiateCheckout, getInitiateCheckout, trackInitiateCheckout } from "./meta-pixel";
import { phoneE164Br } from "./br-docs";

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

describe("fbc", () => {
  it("monta o formato Meta fb.1.<ts>.<fbclid>", () => {
    expect(montarFbc("abc123", 1700000000000)).toBe("fb.1.1700000000000.abc123");
  });

  it("grava cookie com SameSite=Lax e Secure em HTTPS", () => {
    expect(fbcCookieAttrs(true)).toBe("path=/; max-age=7776000; SameSite=Lax; Secure");
    expect(fbcCookieAttrs(false)).toBe("path=/; max-age=7776000; SameSite=Lax");
  });
});

describe("phoneE164Br", () => {
  it("envia dígitos com DDI 55", () => {
    expect(phoneE164Br("11988887777")).toBe("5511988887777");
  });
});

describe("InitiateCheckout único", () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, "window");
    Reflect.deleteProperty(globalThis, "sessionStorage");
    vi.unstubAllGlobals();
  });

  it("não dispara de novo na mesma aba", () => {
    const session = memoryStorage();
    const fbq = vi.fn();
    vi.stubGlobal("window", { fbq, location: { search: "", href: "https://jogadorprosystem.com/checkout", protocol: "https:" } });
    vi.stubGlobal("sessionStorage", session);
    vi.stubGlobal("document", { cookie: "", referrer: "" });

    lembrarInitiateCheckout("initiatecheckout-abc", 1700000000);
    expect(getInitiateCheckout()?.eventId).toBe("initiatecheckout-abc");
    const id = trackInitiateCheckout("anual", 197);
    expect(id).toBe("initiatecheckout-abc");
    expect(fbq).not.toHaveBeenCalled();
  });
});
