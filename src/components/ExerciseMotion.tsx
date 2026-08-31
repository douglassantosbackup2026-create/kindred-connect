import { useId } from "react";
import { cn } from "@/lib/utils";
import {
  motionTemBola,
  motionTemParede,
  poseDaMotion,
  type DemoCategoria,
  type MotionId,
} from "@/data/exercise-motions";

const LABELS: Record<DemoCategoria, string> = {
  mobilidade: "Mobilidade",
  forca: "Força",
  cardio: "Cardio",
  core: "Core",
  bola: "Bola",
};

export function ExerciseMotion({
  motionId,
  nome,
  demo = "cardio",
  compact = false,
  className,
}: {
  motionId: MotionId;
  nome: string;
  demo?: DemoCategoria;
  /** Sem legendas — para cards e capas. */
  compact?: boolean;
  className?: string;
}) {
  const pose = poseDaMotion(motionId);
  const bola = motionTemBola(motionId);
  const parede = motionTemParede(motionId);
  const flip = motionId === "side_plank_left";
  const cones = motionId === "zigzag_dribble" || motionId === "cut_45";
  const caixa = motionId === "box_jump";
  const uid = useId().replace(/:/g, "");

  return (
    <div
      className={cn(
        "exm relative flex aspect-video items-center justify-center overflow-hidden rounded-3xl border border-border bg-secondary",
        className,
      )}
      data-motion={motionId}
      data-pose={pose}
    >
      <svg
        viewBox="0 0 400 225"
        className={cn("h-full w-full text-primary", flip && "exm-flip")}
        role="img"
        aria-label={`Demonstração ilustrada: ${nome}`}
      >
        <defs>
          <linearGradient id={`exm-sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="400" height="225" fill={`url(#exm-sky-${uid})`} />
        <line
          x1="24"
          y1="198"
          x2="376"
          y2="198"
          stroke="currentColor"
          strokeOpacity="0.22"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="48" cy="36" r="18" fill="currentColor" fillOpacity="0.08" />
        <circle cx="360" cy="52" r="28" fill="currentColor" fillOpacity="0.06" />

        {parede ? (
          <g className="exm-wall">
            <rect
              x="318"
              y="78"
              width="14"
              height="120"
              rx="3"
              fill="currentColor"
              fillOpacity="0.28"
            />
            <rect
              x="322"
              y="86"
              width="6"
              height="104"
              rx="1"
              fill="currentColor"
              fillOpacity="0.12"
            />
          </g>
        ) : null}

        {caixa ? (
          <rect
            className="exm-box"
            x="248"
            y="168"
            width="52"
            height="30"
            rx="4"
            fill="currentColor"
            fillOpacity="0.22"
          />
        ) : null}

        {cones ? (
          <g className="exm-cones" fill="currentColor">
            <polygon points="86,198 96,150 106,198" opacity="0.35" />
            <polygon points="294,198 304,150 314,198" opacity="0.35" />
          </g>
        ) : null}

        <g className={cn("exm-stage", `exm-pose-${pose}`)}>
          <g className="exm-travel">
            <g className="exm-athlete">
              <g className="exm-torso">
                <circle className="exm-head" cx="0" cy="-52" r="14" fill="currentColor" />
                <rect
                  className="exm-body"
                  x="-11"
                  y="-36"
                  width="22"
                  height="44"
                  rx="10"
                  fill="currentColor"
                />
                <g className="exm-arm-l">
                  <rect
                    x="-18"
                    y="-30"
                    width="8"
                    height="38"
                    rx="4"
                    fill="currentColor"
                    fillOpacity="0.85"
                  />
                </g>
                <g className="exm-arm-r">
                  <rect
                    x="10"
                    y="-30"
                    width="8"
                    height="38"
                    rx="4"
                    fill="currentColor"
                    fillOpacity="0.85"
                  />
                </g>
              </g>
              <g className="exm-leg-l">
                <rect x="-12" y="8" width="10" height="42" rx="5" fill="currentColor" />
                <rect
                  className="exm-shin-l"
                  x="-11"
                  y="46"
                  width="8"
                  height="36"
                  rx="4"
                  fill="currentColor"
                  fillOpacity="0.9"
                />
              </g>
              <g className="exm-leg-r">
                <rect x="2" y="8" width="10" height="42" rx="5" fill="currentColor" />
                <rect
                  className="exm-shin-r"
                  x="3"
                  y="46"
                  width="8"
                  height="36"
                  rx="4"
                  fill="currentColor"
                  fillOpacity="0.9"
                />
              </g>
              {bola ? (
                <circle className="exm-ball" cx="28" cy="78" r="10" fill="currentColor" />
              ) : null}
            </g>
          </g>
        </g>
      </svg>

      {compact ? null : (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/80 via-background/35 to-transparent px-4 pb-3 pt-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
            {LABELS[demo]}
          </p>
          <p className="truncate text-sm font-extrabold text-foreground">{nome}</p>
        </div>
      )}
    </div>
  );
}
