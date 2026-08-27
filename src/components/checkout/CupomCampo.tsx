import { useState } from "react";
import { Loader2, TicketPercent } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  aplicado: { code: string; discount: number } | null;
  onBuscar: (codigo: string) => Promise<{ code: string; discount_percent: number } | null>;
  onAplicar: (cupom: { code: string; discount: number }) => void;
};

/** Campo de cupom recolhido atrás de um link, no resumo do pedido. */
export function CupomCampo({ aplicado, onBuscar, onAplicar }: Props) {
  const [aberto, setAberto] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [buscando, setBuscando] = useState(false);

  if (aplicado) {
    return (
      <p className="mt-3 text-xs font-semibold text-primary">
        Cupom {aplicado.code} aplicado (−{aplicado.discount}%)
      </p>
    );
  }

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary underline underline-offset-4"
      >
        <TicketPercent className="h-3.5 w-3.5" />
        Tenho um cupom de desconto
      </button>
    );
  }

  const aplicar = async () => {
    const valor = codigo.trim();
    if (!valor) return;
    setBuscando(true);
    try {
      const achado = await onBuscar(valor);
      if (!achado) {
        toast.error("Cupom inválido ou expirado.");
        return;
      }
      onAplicar({ code: achado.code, discount: achado.discount_percent });
      toast.success(`Cupom aplicado: −${achado.discount_percent}%`);
    } catch {
      toast.error("Não foi possível validar o cupom agora.");
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="mt-3 flex gap-2">
      <Input
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        placeholder="Código do cupom"
        aria-label="Código do cupom"
        className="h-10"
      />
      <Button type="button" variant="outline" className="h-10" disabled={buscando} onClick={() => void aplicar()}>
        {buscando ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aplicar"}
      </Button>
    </div>
  );
}
