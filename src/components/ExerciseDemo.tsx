import { useEffect, useState } from "react";
import { Play, VideoOff } from "lucide-react";
import { urlVideoSegura, urlEmbedSegura } from "@/lib/video-url";
import { ExerciseGuide } from "@/components/ExerciseGuide";
import { ExerciseMotion } from "@/components/ExerciseMotion";
import { motionDoExercicio, type DemoCategoria } from "@/data/exercise-motions";

function VideoSkeleton() {
  return (
    <div className="absolute inset-0 animate-pulse bg-secondary">
      <div className="absolute inset-x-6 bottom-6 h-2 rounded-full bg-card" />
      <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-card" />
    </div>
  );
}

export function ExerciseDemo({
  demo = "cardio",
  nome,
  videoUrl,
  guia = true,
  motionId,
}: {
  demo?: DemoCategoria;
  nome: string;
  videoUrl?: string;
  /** Mostra o guia de execução escrito (padrão). Desligue em vídeos de capa. */
  guia?: boolean;
  /** Cena ilustrada. Sem isso, deriva do nome do exercício. */
  motionId?: ReturnType<typeof motionDoExercicio>;
}) {
  const [carregando, setCarregando] = useState(true);
  const [falhou, setFalhou] = useState(false);
  // Embeds só montam o iframe depois do play (evita carregar o player de terceiros à toa).
  const [ativo, setAtivo] = useState(false);
  const ilustracaoId = motionId ?? motionDoExercicio(nome, demo);

  useEffect(() => {
    setCarregando(true);
    setFalhou(false);
    setAtivo(false);
  }, [videoUrl]);

  if (!videoUrl) {
    return (
      <div>
        <ExerciseMotion motionId={ilustracaoId} nome={nome} demo={demo} />
        {guia ? <ExerciseGuide nome={nome} demo={demo} /> : null}
      </div>
    );
  }

  if (falhou) {
    return (
      <div>
        <div className="relative flex aspect-video flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl border border-border bg-secondary px-6 text-center">
          <VideoOff className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-extrabold text-foreground">Vídeo indisponível</p>
          <p className="text-[11px] text-muted-foreground">
            Não conseguimos carregar a demonstração de “{nome}”. Siga o guia de execução abaixo.
          </p>
          <button
            type="button"
            onClick={() => {
              setFalhou(false);
              setCarregando(true);
            }}
            className="mt-1 text-xs font-semibold text-primary underline underline-offset-4"
          >
            Tentar de novo
          </button>
        </div>
        {guia ? <ExerciseGuide nome={nome} demo={demo} /> : null}
      </div>
    );
  }

  const seguro = urlVideoSegura(videoUrl);
  if (!seguro) {
    return (
      <div>
        <ExerciseMotion motionId={ilustracaoId} nome={nome} demo={demo} />
        {guia ? <ExerciseGuide nome={nome} demo={demo} /> : null}
      </div>
    );
  }

  const embedSrc = urlEmbedSegura(seguro);
  const isEmbed = Boolean(embedSrc);

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-3xl border border-border bg-card">
        {carregando && (!isEmbed || ativo) ? <VideoSkeleton /> : null}
        {isEmbed && !ativo ? (
          <button
            type="button"
            onClick={() => setAtivo(true)}
            className="group flex h-full w-full flex-col items-center justify-center gap-2 bg-secondary"
            aria-label={`Reproduzir demonstração de ${nome}`}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <Play className="h-6 w-6 fill-current" />
            </span>
            <span className="px-6 text-center text-xs font-semibold text-muted-foreground">
              Tocar demonstração — {nome}
            </span>
          </button>
        ) : isEmbed ? (
          <iframe
            loading="lazy"
            title={nome}
            src={`${embedSrc}?autoplay=1`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setCarregando(false)}
            onError={() => {
              setCarregando(false);
              setFalhou(true);
            }}
          />
        ) : (
          <video
            className="h-full w-full object-cover"
            src={seguro}
            controls
            playsInline
            preload="none"
            onLoadedData={() => setCarregando(false)}
            onCanPlay={() => setCarregando(false)}
            onError={() => {
              setCarregando(false);
              setFalhou(true);
            }}
          />
        )}
      </div>
      {guia ? <ExerciseGuide nome={nome} demo={demo} variante="recolhido" /> : null}
    </div>
  );
}
