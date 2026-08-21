ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS objetivo text,
  ADD COLUMN IF NOT EXISTS disponibilidade text,
  ADD COLUMN IF NOT EXISTS posicao text DEFAULT 'qualquer',
  ADD COLUMN IF NOT EXISTS cancel_reason text,
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz,
  ADD COLUMN IF NOT EXISTS affiliate_code text,
  ADD COLUMN IF NOT EXISTS referred_by text,
  ADD COLUMN IF NOT EXISTS reminder_hour int DEFAULT 20,
  ADD COLUMN IF NOT EXISTS telegram_joined boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS paused_until timestamptz,
  ADD COLUMN IF NOT EXISTS pause_reason text;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_affiliate_code_uidx
  ON public.profiles (affiliate_code)
  WHERE affiliate_code IS NOT NULL;

ALTER TABLE public.payment_events
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS utm_term text,
  ADD COLUMN IF NOT EXISTS affiliate_ref text,
  ADD COLUMN IF NOT EXISTS coupon_code text,
  ADD COLUMN IF NOT EXISTS discount_percent int;

CREATE TABLE IF NOT EXISTS public.weekly_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  week_start date NOT NULL,
  explosao int NOT NULL CHECK (explosao BETWEEN 1 AND 5),
  controle int NOT NULL CHECK (controle BETWEEN 1 AND 5),
  resistencia int NOT NULL CHECK (resistencia BETWEEN 1 AND 5),
  jogou boolean NOT NULL DEFAULT false,
  nota text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, week_start)
);

ALTER TABLE public.weekly_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own weekly scores" ON public.weekly_scores
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read affiliate clicks" ON public.affiliate_clicks
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE TABLE IF NOT EXISTS public.league_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  week_start date NOT NULL,
  treinos int NOT NULL DEFAULT 0,
  minutos int NOT NULL DEFAULT 0,
  streak_peak int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, week_start)
);

ALTER TABLE public.league_entries ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.escolinha_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text NOT NULL,
  telefone text,
  escolinha text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.escolinha_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read escolinha leads" ON public.escolinha_leads
  FOR SELECT TO authenticated
  USING (public.is_admin());

REVOKE ALL ON TABLE public.weekly_scores FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.weekly_scores TO authenticated;
GRANT ALL ON TABLE public.weekly_scores TO service_role;

REVOKE ALL ON TABLE public.league_entries FROM anon;
GRANT SELECT ON TABLE public.league_entries TO authenticated;
GRANT ALL ON TABLE public.league_entries TO service_role;

REVOKE ALL ON TABLE public.affiliate_clicks FROM anon, authenticated;
GRANT INSERT, SELECT ON TABLE public.affiliate_clicks TO service_role;
GRANT SELECT ON TABLE public.affiliate_clicks TO authenticated;
GRANT ALL ON TABLE public.affiliate_clicks TO service_role;

REVOKE ALL ON TABLE public.escolinha_leads FROM anon, authenticated;
GRANT INSERT, SELECT ON TABLE public.escolinha_leads TO service_role;
GRANT SELECT ON TABLE public.escolinha_leads TO authenticated;
GRANT ALL ON TABLE public.escolinha_leads TO service_role;

CREATE TABLE IF NOT EXISTS public.coupons (
  code text PRIMARY KEY,
  discount_percent int NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 50),
  affiliate_code text,
  active boolean NOT NULL DEFAULT true,
  max_redemptions int,
  redemptions int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active coupons" ON public.coupons
  FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins manage coupons" ON public.coupons
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT SELECT ON TABLE public.coupons TO anon, authenticated;
GRANT ALL ON TABLE public.coupons TO service_role;

INSERT INTO public.coupons (code, discount_percent, affiliate_code, active)
VALUES
  ('PRO10', 10, null, true),
  ('AMIGO15', 15, null, true)
ON CONFLICT (code) DO NOTHING;

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS public.treino_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  treino_id text NOT NULL,
  exercicio_nome text,
  tipo text NOT NULL DEFAULT 'link',
  url text,
  storage_path text,
  titulo text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS treino_videos_unico
  ON public.treino_videos (treino_id, coalesce(exercicio_nome, ''));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.treino_videos TO authenticated;
GRANT ALL ON public.treino_videos TO service_role;

ALTER TABLE public.treino_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam videos" ON public.treino_videos
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TRIGGER update_treino_videos_updated_at
  BEFORE UPDATE ON public.treino_videos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.sessoes
  ADD CONSTRAINT sessoes_user_treino_data_key UNIQUE (user_id, treino_id, data);

REVOKE INSERT, UPDATE ON public.sessoes FROM authenticated, anon;

CREATE POLICY "Users read own league row"
  ON public.league_entries FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

CREATE OR REPLACE VIEW public.ranking_semanal
WITH (security_invoker = on) AS
SELECT
  le.week_start,
  COALESCE(p.nome, 'Jogador') AS nome,
  le.treinos,
  le.minutos,
  le.streak_peak,
  ROW_NUMBER() OVER (
    PARTITION BY le.week_start
    ORDER BY le.treinos DESC, le.minutos DESC, le.streak_peak DESC
  ) AS posicao
FROM public.league_entries le
LEFT JOIN public.profiles p ON p.id = le.user_id;

REVOKE ALL ON public.ranking_semanal FROM anon;
GRANT SELECT ON public.ranking_semanal TO authenticated;