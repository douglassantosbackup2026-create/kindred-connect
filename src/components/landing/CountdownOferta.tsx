import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const CHAVE = "jp_oferta_deadline";
const DURACAO_MS = 15 * 60 * 1000;

function deadlineDaSessao(): number {
  const agora = Date.now();
  if (typeof window === "undefined") return agora + DURACAO_MS;
  try {
    const salvo = Number(window.sessionStorage.getItem(CHAVE));
    if (salvo && salvo > agora) return salvo;
    const novo = agora + DURACAO_MS;
    window.sessionStorage.setItem(CHAVE, String(novo));
    return novo;
  } catch {
    return agora + DURACAO_MS;
  }
}

function formatar(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/** Contador da condição de lançamento (por sessão). Renderiza só no cliente para evitar mismatch. */
export function CountdownOferta({ className }: { className?: string }) {
  const [texto, setTexto] = useState<string | null>(null);

  useEffect(() => {
    const alvo = deadlineDaSessao();
    const tick = () => setTexto(formatar(alvo - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={cn("font-mono font-black tabular-nums text-primary", className)}>{texto ?? "--:--"}</span>
  );
}
