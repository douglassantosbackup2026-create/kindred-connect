import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

type Opcoes = {
  /** Quando false, o erro fica só no estado `erro` (exibição inline). */
  toastErro?: boolean;
  fallback?: string;
};

export function useAdminTable<T>(loader: () => Promise<T[]>, opcoes: Opcoes = {}) {
  const { toastErro = true, fallback = "Erro ao listar" } = opcoes;
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setErro(null);
    void loader()
      .then(setRows)
      .catch((e) => {
        const msg = getErrorMessage(e, fallback);
        setErro(msg);
        if (toastErro) toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, [loader, toastErro, fallback]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { rows, loading, erro, reload };
}

/** Mesmo padrão para um único registro (ex.: estatísticas do dashboard). */
export function useAdminResource<T>(loader: () => Promise<T>, fallback = "Falha ao carregar") {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setErro(null);
    void loader()
      .then(setData)
      .catch((e) => setErro(getErrorMessage(e, fallback)))
      .finally(() => setLoading(false));
  }, [loader, fallback]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, erro, reload };
}
