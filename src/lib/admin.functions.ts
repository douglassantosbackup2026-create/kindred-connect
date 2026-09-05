import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function garantirAdmin(supabase: SupabaseClient<Database>) {
  const { data } = await supabase.rpc("is_admin");
  if (!data) throw new Error("Forbidden");
}

export const searchAdminUsers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ q: z.string().trim().max(120).optional() }).parse(data ?? {}))
  .handler(async ({ data, context }) => {
    await garantirAdmin(context.supabase);
    const { data: rows, error } = await context.supabase.rpc("admin_search_users", {
      p_q: data.q ?? "",
    });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const setAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        userId: z.string().uuid(),
        role: z.enum(["user", "admin"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: auth } = await context.supabase.auth.getUser();
    if (!auth.user) throw new Error("Unauthorized");
    await garantirAdmin(context.supabase);
    if (auth.user.id === data.userId && data.role !== "admin") {
      throw new Error("Você não pode remover o próprio acesso admin");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("profiles").update({ role: data.role }).eq("id", data.userId);
    if (error) throw new Error(error.message);
    return { ok: true as const, role: data.role };
  });

export type CheckoutD0Funil = {
  started: number;
  purchased: number;
  purchasedRate: number;
  d0: number;
  d0Rate: number;
};

/** CheckoutStep (intent) → Pix aprovado → 1º treino no mesmo dia. Service role: RLS own-only. */
export const fetchCheckoutD0Funil = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({}).parse(data ?? {}))
  .handler(async ({ context }): Promise<CheckoutD0Funil> => {
    await garantirAdmin(context.supabase);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date();
    since.setDate(since.getDate() - 7);
    const iso7 = since.toISOString();

    const { data: intents } = await supabaseAdmin
      .from("checkout_intents")
      .select("user_id, started_at, purchased_at")
      .gte("started_at", iso7)
      .limit(2000);

    const started = intents?.length ?? 0;
    const purchasedRows = (intents ?? []).filter((i) => i.purchased_at);
    const purchased = purchasedRows.length;
    const userIds = [...new Set(purchasedRows.map((i) => i.user_id))];
    let d0 = 0;

    if (userIds.length) {
      const { data: sess } = await supabaseAdmin
        .from("sessoes")
        .select("user_id, created_at, data")
        .in("user_id", userIds)
        .limit(4000);
      const byUser = new Map<string, number[]>();
      for (const s of sess ?? []) {
        const list = byUser.get(s.user_id) ?? [];
        list.push(new Date(s.created_at || `${s.data}T12:00:00.000Z`).getTime());
        byUser.set(s.user_id, list);
      }
      for (const row of purchasedRows) {
        const payAt = new Date(row.purchased_at!).getTime();
        const times = byUser.get(row.user_id) ?? [];
        if (times.some((t) => t >= payAt && t <= payAt + 24 * 3600 * 1000)) d0 += 1;
      }
    }

    return {
      started,
      purchased,
      purchasedRate: started ? Math.round((purchased / started) * 100) : 0,
      d0,
      d0Rate: purchased ? Math.round((d0 / purchased) * 100) : 0,
    };
  });

export type { VendasFunil } from "@/lib/vendas-funil";

export const fetchVendasFunil = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ dias: z.union([z.literal(7), z.literal(30)]) }).parse(data))
  .handler(async ({ data, context }) => {
    await garantirAdmin(context.supabase);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { montarVendasFunil } = await import("@/lib/vendas-funil");
    const since = new Date();
    since.setDate(since.getDate() - data.dias);
    const iso = since.toISOString();

    const [funnelRes, intentsRes, paymentsRes] = await Promise.all([
      supabaseAdmin.from("funnel_events").select("step, visitor_id").gte("created_at", iso).limit(10000),
      supabaseAdmin.from("checkout_intents").select("user_id").gte("started_at", iso).limit(5000),
      supabaseAdmin
        .from("payment_events")
        .select("event_type, user_id")
        .gte("created_at", iso)
        .limit(5000),
    ]);

    if (funnelRes.error) throw new Error(funnelRes.error.message);
    if (intentsRes.error) throw new Error(intentsRes.error.message);
    if (paymentsRes.error) throw new Error(paymentsRes.error.message);

    return montarVendasFunil({
      dias: data.dias,
      funnel: funnelRes.data ?? [],
      intentUserIds: (intentsRes.data ?? []).map((r) => r.user_id),
      payments: paymentsRes.data ?? [],
    });
  });

export type CapiStatus = {
  configured: boolean;
  runtime: "start";
};

/** Só diz se o token existe neste runtime (Start). Sem devolver o valor. */
export const fetchCapiStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({}).parse(data ?? {}))
  .handler(async ({ context }): Promise<CapiStatus> => {
    await garantirAdmin(context.supabase);
    return {
      configured: Boolean(process.env["META_CAPI_ACCESS_TOKEN"]),
      runtime: "start",
    };
  });
