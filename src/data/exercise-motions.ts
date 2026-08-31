import type { Exercicio } from "@/data/training";

/** Cenas ilustradas — uma por gesto distinto. */
export const MOTION_IDS = [
  "hip_mobility",
  "squat",
  "squat_jump",
  "bulgarian",
  "lunge",
  "lunge_jump",
  "calf_raise",
  "glute_bridge",
  "wall_sit",
  "plank",
  "side_plank",
  "side_plank_left",
  "plank_tap",
  "dynamic_plank",
  "rower",
  "lower_abs",
  "superman",
  "jog",
  "high_knees",
  "jumping_jack",
  "sprint",
  "shuttle",
  "lateral_skip",
  "walk",
  "breathing",
  "posterior_stretch",
  "shoulder_mobility",
  "warmup_dynamic",
  "ball_taps",
  "sole_rolls",
  "zigzag_dribble",
  "wall_control",
  "pass",
  "finish",
  "cut_45",
  "gk_dive",
  "jump_land",
  "box_jump",
  "lateral_jump",
] as const;

export type MotionId = (typeof MOTION_IDS)[number];

export type DemoCategoria = NonNullable<Exercicio["demo"]>;

/** Chave = nome exato do exercício em training.ts. */
export const MOTION_DO_EXERCICIO: Record<string, MotionId> = {
  "Mobilidade de quadril": "hip_mobility",
  "Agachamento livre": "squat",
  "Prancha frontal": "plank",
  "Afundo alternado": "lunge",
  "Corrida estacionária": "jog",
  "Alongamento posterior": "posterior_stretch",
  "Toques com o peito do pé": "ball_taps",
  "Condução em zigue-zague": "zigzag_dribble",
  "Domínio na parede": "wall_control",
  "Sola frente e trás": "sole_rolls",
  "Passe forte alternado": "pass",
  "Prancha isométrica": "plank",
  "Prancha lateral direita": "side_plank",
  "Prancha lateral esquerda": "side_plank_left",
  "Abdominal remador": "rower",
  Superman: "superman",
  "Salto vertical": "jump_land",
  "Tiro de 10 metros": "sprint",
  "Agachamento com salto": "squat_jump",
  "Prancha com toque no ombro": "plank_tap",
  "Skipping alto": "high_knees",
  "Corrida contínua": "jog",
  "Tiros de 30 metros": "sprint",
  "Vai e vem": "shuttle",
  "Corrida com mudança de ritmo": "jog",
  "Volta à calma": "walk",
  "Agachamento búlgaro": "bulgarian",
  "Passada longa": "lunge",
  "Elevação de panturrilha": "calf_raise",
  "Ponte de glúteo": "glute_bridge",
  "Isometria na parede": "wall_sit",
  Polichinelo: "jumping_jack",
  Prancha: "plank",
  "Tiro curto no lugar": "sprint",
  "Abdominal infra": "lower_abs",
  "Prancha lateral": "side_plank",
  "Aquecimento dinâmico": "warmup_dynamic",
  "Tiros progressivos": "sprint",
  "Saltos laterais": "lateral_jump",
  "Condução em velocidade": "zigzag_dribble",
  Finalizações: "finish",
  "Tiros curtos no lugar": "sprint",
  "Respiração + foco": "breathing",
  "Caminhada leve no lugar": "walk",
  "Prancha leve": "plank",
  "Respiração diafragmática": "breathing",
  "Salto em caixa (sem caixa)": "box_jump",
  "Aceleração 8s": "sprint",
  "Afundo com impulso": "lunge_jump",
  "Prancha dinâmica": "dynamic_plank",
  "Cone imaginário — zigue": "zigzag_dribble",
  "Corte 45°": "cut_45",
  "Skipping lateral": "lateral_skip",
  "Toques sola": "sole_rolls",
  Respiração: "breathing",
  "Queda lateral controlada": "gk_dive",
  "Prancha + toque": "plank_tap",
  "Salto + aterrissagem": "jump_land",
  "Mobilidade de ombro": "shoulder_mobility",
};

const FALLBACK_POR_CATEGORIA: Record<DemoCategoria, MotionId> = {
  mobilidade: "hip_mobility",
  forca: "squat",
  cardio: "jog",
  core: "plank",
  bola: "ball_taps",
};

/** Capa (assinatura) de cada treino. */
export const MOTION_DA_CAPA: Record<string, MotionId> = {
  "base-mobilidade": "hip_mobility",
  "controle-bola": "ball_taps",
  "core-forte": "plank",
  "explosao-core": "squat_jump",
  "resistencia-campo": "jog",
  "forca-pernas": "bulgarian",
  "rapido-10": "jumping_jack",
  "rapido-core": "plank",
  "performance-final": "finish",
  "pre-partida": "high_knees",
  "pos-jogo": "posterior_stretch",
  "ciclo-potencia": "box_jump",
  "ciclo-agilidade": "zigzag_dribble",
  "ciclo-goleiro": "gk_dive",
};

export function motionDoExercicio(nome: string, demo: DemoCategoria = "cardio"): MotionId {
  return MOTION_DO_EXERCICIO[nome] ?? FALLBACK_POR_CATEGORIA[demo] ?? "jog";
}

export function motionDaCapa(treinoId: string): MotionId {
  return MOTION_DA_CAPA[treinoId] ?? "jog";
}

export function motionTemBola(id: MotionId): boolean {
  return (
    id === "ball_taps" ||
    id === "sole_rolls" ||
    id === "zigzag_dribble" ||
    id === "wall_control" ||
    id === "pass" ||
    id === "finish"
  );
}

export function motionTemParede(id: MotionId): boolean {
  return id === "wall_control" || id === "wall_sit";
}

export type MotionPose = "stand" | "plank" | "side" | "back" | "prone";

export function poseDaMotion(id: MotionId): MotionPose {
  switch (id) {
    case "plank":
    case "plank_tap":
    case "dynamic_plank":
      return "plank";
    case "side_plank":
    case "side_plank_left":
      return "side";
    case "glute_bridge":
    case "rower":
    case "lower_abs":
      return "back";
    case "superman":
      return "prone";
    default:
      return "stand";
  }
}
