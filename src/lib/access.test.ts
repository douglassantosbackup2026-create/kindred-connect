import { describe, expect, it } from "vitest";
import { TREINO_PREVIEW_GRATIS, canAccessTreino } from "./access";

describe("canAccessTreino", () => {
  it("permanece 100% pago enquanto o preview grátis estiver desligado", () => {
    expect(TREINO_PREVIEW_GRATIS).toBe(false);
    expect(canAccessTreino(false, "base-mobilidade")).toBe(false);
    expect(canAccessTreino(true, "base-mobilidade")).toBe(true);
  });
});
