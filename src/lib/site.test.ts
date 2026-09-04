import { describe, expect, it } from "vitest";
import { OG_IMAGE, SITE_ORIGIN, siteUrl } from "./site";

describe("siteUrl", () => {
  it("usa o domínio de produção", () => {
    expect(SITE_ORIGIN).toBe("https://jogadorprosystem.com");
    expect(siteUrl("/")).toBe("https://jogadorprosystem.com/");
    expect(siteUrl("/pro3")).toBe("https://jogadorprosystem.com/pro3");
    expect(OG_IMAGE).toBe("https://jogadorprosystem.com/og-cover.jpg");
  });
});
