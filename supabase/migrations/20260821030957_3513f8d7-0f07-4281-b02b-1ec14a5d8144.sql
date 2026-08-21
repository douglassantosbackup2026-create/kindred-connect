CREATE TABLE IF NOT EXISTS public.sugestoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  nome text NOT NULL,
  email text NOT NULL,
  tipo text NOT NULL DEFAULT 'sugestao',
  mensagem text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sugestoes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sugestoes FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.sugestoes TO authenticated;
GRANT ALL ON public.sugestoes TO service_role;

CREATE POLICY "Apenas admins leem sugestões"
ON public.sugestoes FOR SELECT TO authenticated
USING (public.is_admin());

CREATE TABLE IF NOT EXISTS public.sugestoes_rate_limit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text NOT NULL,
  janela timestamptz NOT NULL,
  envios integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS sugestoes_rate_limit_unico
  ON public.sugestoes_rate_limit (chave, janela);

GRANT ALL ON public.sugestoes_rate_limit TO service_role;
ALTER TABLE public.sugestoes_rate_limit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Somente servico gerencia rate limit"
  ON public.sugestoes_rate_limit FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE TRIGGER update_sugestoes_rate_limit_updated_at
  BEFORE UPDATE ON public.sugestoes_rate_limit
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS assinante_until timestamptz,
  ADD COLUMN IF NOT EXISTS onboarding_done boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pause_used_at timestamptz,
  ADD COLUMN IF NOT EXISTS cpf text,
  ADD COLUMN IF NOT EXISTS phone text;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_cpf_digits CHECK (cpf IS NULL OR cpf ~ '^\d{11}$');
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_phone_digits CHECK (phone IS NULL OR phone ~ '^\d{10,11}$');

CREATE TABLE IF NOT EXISTS public.checkout_intents (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plano text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  recovered_at timestamptz,
  purchased_at timestamptz
);

ALTER TABLE public.checkout_intents ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.checkout_intents FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE ON TABLE public.checkout_intents TO authenticated;
GRANT ALL ON TABLE public.checkout_intents TO service_role;

CREATE POLICY checkout_intents_select_own
  ON public.checkout_intents FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);
CREATE POLICY checkout_intents_insert_own
  ON public.checkout_intents FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY checkout_intents_update_own
  ON public.checkout_intents FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE INDEX IF NOT EXISTS checkout_intents_recovery_idx
  ON public.checkout_intents (last_seen_at)
  WHERE purchased_at IS NULL AND recovered_at IS NULL;

CREATE INDEX IF NOT EXISTS profiles_assinante_until_idx
  ON public.profiles (assinante_until)
  WHERE assinante = true AND assinante_until IS NOT NULL;

ALTER TABLE public.checkout_intents
  ADD CONSTRAINT checkout_intents_plano_check
  CHECK (plano IN ('mensal', 'semestral', 'anual'));

ALTER TABLE public.checkout_intents
  ADD COLUMN IF NOT EXISTS status text
  GENERATED ALWAYS AS (
    CASE
      WHEN purchased_at IS NOT NULL THEN 'purchased'
      WHEN recovered_at IS NOT NULL THEN 'recovered'
      ELSE 'seen'
    END
  ) STORED;

CREATE OR REPLACE FUNCTION public.enforce_checkout_intents()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  jwt_role text := coalesce(auth.jwt() ->> 'role', '');
BEGIN
  IF jwt_role = 'service_role'
     OR current_user IN ('postgres', 'supabase_admin') THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.purchased_at := NULL;
    NEW.recovered_at := NULL;
    NEW.user_id := (select auth.uid());
    RETURN NEW;
  END IF;

  NEW.user_id := OLD.user_id;
  NEW.purchased_at := OLD.purchased_at;
  NEW.recovered_at := OLD.recovered_at;
  NEW.started_at := OLD.started_at;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_checkout_intents
  BEFORE INSERT OR UPDATE ON public.checkout_intents
  FOR EACH ROW EXECUTE FUNCTION public.enforce_checkout_intents();

REVOKE ALL ON FUNCTION public.enforce_checkout_intents() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_checkout_intents() TO postgres, service_role;

CREATE OR REPLACE FUNCTION public.acesso_pro_ativo()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = (select auth.uid())
      AND p.assinante = true
      AND (p.assinante_until IS NULL OR p.assinante_until > now())
  );
$$;

REVOKE ALL ON FUNCTION public.acesso_pro_ativo() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.acesso_pro_ativo() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.redeem_coupon(p_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.coupons
  SET redemptions = redemptions + 1
  WHERE code = p_code
    AND active = true
    AND (max_redemptions IS NULL OR redemptions < max_redemptions);
  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.redeem_coupon(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_coupon(text) TO service_role;

CREATE TABLE IF NOT EXISTS public.lifecycle_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  sent_on date NOT NULL DEFAULT ((now() AT TIME ZONE 'America/Sao_Paulo')::date),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, kind, sent_on)
);

ALTER TABLE public.lifecycle_emails ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.lifecycle_emails FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.lifecycle_emails TO service_role;

CREATE POLICY "Assinantes leem videos" ON public.treino_videos
  FOR SELECT TO authenticated
  USING (public.is_admin() OR public.acesso_pro_ativo());

CREATE OR REPLACE FUNCTION public.enforce_subscription_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  jwt_role text := coalesce(auth.jwt() ->> 'role', '');
  privileged boolean;
BEGIN
  privileged :=
    jwt_role = 'service_role'
    OR current_user IN ('postgres', 'supabase_admin');

  IF TG_OP = 'UPDATE' THEN
    IF NOT privileged AND NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'role is read-only for clients';
    END IF;
  ELSIF TG_OP = 'INSERT' AND NOT privileged THEN
    NEW.role := 'user';
  END IF;

  IF privileged OR public.is_admin() THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.assinante := false;
    NEW.plano := NULL;
    NEW.assinante_until := NULL;
    NEW.stripe_customer_id := NULL;
    NEW.stripe_subscription_id := NULL;
    NEW.mp_payer_id := NULL;
    NEW.mp_payment_id := NULL;
    NEW.paused_until := NULL;
    NEW.pause_reason := NULL;
    NEW.pause_used_at := NULL;
    NEW.cancelled_at := NULL;
    NEW.cancel_reason := NULL;
    NEW.referred_by := NULL;
    RETURN NEW;
  END IF;

  IF NEW.assinante IS DISTINCT FROM OLD.assinante
     OR NEW.plano IS DISTINCT FROM OLD.plano
     OR NEW.assinante_until IS DISTINCT FROM OLD.assinante_until
     OR NEW.stripe_customer_id IS DISTINCT FROM OLD.stripe_customer_id
     OR NEW.stripe_subscription_id IS DISTINCT FROM OLD.stripe_subscription_id
     OR NEW.mp_payer_id IS DISTINCT FROM OLD.mp_payer_id
     OR NEW.mp_payment_id IS DISTINCT FROM OLD.mp_payment_id
     OR NEW.paused_until IS DISTINCT FROM OLD.paused_until
     OR NEW.pause_reason IS DISTINCT FROM OLD.pause_reason
     OR NEW.pause_used_at IS DISTINCT FROM OLD.pause_used_at
     OR NEW.cancelled_at IS DISTINCT FROM OLD.cancelled_at
     OR NEW.cancel_reason IS DISTINCT FROM OLD.cancel_reason
     OR NEW.referred_by IS DISTINCT FROM OLD.referred_by THEN
    RAISE EXCEPTION 'subscription/admin fields are read-only for clients';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_subscription_fields() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_subscription_fields() TO postgres, service_role;

CREATE TRIGGER protect_profiles_subscription
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_subscription_fields();

CREATE OR REPLACE FUNCTION public.vault_secret(p_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  secret text;
BEGIN
  IF p_name IS NULL OR p_name NOT IN ('cron_secret', 'mercadopago_webhook_secret') THEN
    RAISE EXCEPTION 'vault_secret: name not allowed';
  END IF;
  SELECT decrypted_secret INTO secret
  FROM vault.decrypted_secrets
  WHERE name = p_name
  LIMIT 1;
  RETURN secret;
END;
$$;

REVOKE ALL ON FUNCTION public.vault_secret(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.vault_secret(text) TO service_role;

CREATE OR REPLACE FUNCTION public.admin_search_users(p_q text DEFAULT '')
RETURNS TABLE (
  id uuid,
  nome text,
  assinante boolean,
  plano text,
  role text,
  created_at timestamptz,
  email text,
  mp_payment_id text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  q text := trim(coalesce(p_q, ''));
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  q := replace(replace(replace(q, '\', '\\'), '%', '\%'), '_', '\_');

  RETURN QUERY
  SELECT
    p.id,
    p.nome,
    p.assinante,
    p.plano,
    p.role,
    p.created_at,
    u.email::text,
    p.mp_payment_id
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.id
  WHERE q = ''
     OR p.nome ILIKE '%' || q || '%' ESCAPE '\'
     OR u.email ILIKE '%' || q || '%' ESCAPE '\'
     OR p.id::text ILIKE '%' || q || '%' ESCAPE '\'
  ORDER BY p.created_at DESC
  LIMIT 200;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_search_users(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_search_users(text) TO authenticated, service_role;

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO postgres, service_role;

CREATE OR REPLACE FUNCTION private.cron_edge_headers()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  secret text;
BEGIN
  SELECT decrypted_secret INTO secret
  FROM vault.decrypted_secrets
  WHERE name = 'cron_secret'
  LIMIT 1;
  IF secret IS NULL OR btrim(secret) = '' THEN
    RAISE EXCEPTION 'vault secret cron_secret missing';
  END IF;
  RETURN jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer ' || secret
  );
END;
$$;

REVOKE ALL ON FUNCTION private.cron_edge_headers() FROM PUBLIC, anon, authenticated;

DO $$
DECLARE
  jid bigint;
BEGIN
  SELECT jobid INTO jid FROM cron.job WHERE jobname = 'expire-pro-access-hourly';
  IF jid IS NOT NULL THEN PERFORM cron.unschedule(jid); END IF;
  PERFORM cron.schedule(
    'expire-pro-access-hourly',
    '20 * * * *',
    $cron$UPDATE public.profiles
      SET assinante = false,
          cancel_reason = COALESCE(cancel_reason, 'expired'),
          cancelled_at = COALESCE(cancelled_at, now())
      WHERE assinante = true
        AND assinante_until IS NOT NULL
        AND assinante_until < now()$cron$
  );
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'cron expire-pro-access-hourly: %', SQLERRM;
END $$;