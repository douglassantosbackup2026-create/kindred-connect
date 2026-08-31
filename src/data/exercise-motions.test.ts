import { describe, expect, it } from "vitest";
import { TREINOS } from "./training";
import {
  MOTION_DA_CAPA,
  MOTION_DO_EXERCICIO,
  motionDaCapa,
  motionDoExercicio,
} from "./exercise-motions";

describe("exercise-motions", () => {
  it("mapeia cada exercício do catálogo pelo nome exato", () => {
    for (const treino of TREINOS) {
      for (const ex of treino.exercicios) {
        expect(MOTION_DO_EXERCICIO[ex.nome], `${treino.id} → ${ex.nome}`).toBeDefined();
        expect(motionDoExercicio(ex.nome, ex.demo)).toBe(MOTION_DO_EXERCICIO[ex.nome]);
      }
    }
  });

  it("tem capa para cada treino", () => {
    for (const treino of TREINOS) {
      expect(MOTION_DA_CAPA[treino.id], treino.id).toBeDefined();
      expect(motionDaCapa(treino.id)).toBe(MOTION_DA_CAPA[treino.id]);
    }
  });
});
