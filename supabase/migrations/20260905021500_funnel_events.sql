CREATE TABLE IF NOT EXISTS public.funnel_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  step text NOT NULL,
  visitor_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  from_page text,
  utm_source text,
  utm_campaign text,
  CONSTRAINT funnel_events_step_check
    CHECK (step IN ('landing', 'checkout', 'signup', 'pay_start', 'purchase')),
  CONSTRAINT funnel_events_visitor_len
    CHECK (char_length(visitor_id) BETWEEN 8 AND 80),
  CONSTRAINT funnel_events_from_len
    CHECK (from_page IS NULL OR char_length(from_page) <= 80),
  CONSTRAINT funnel_events_utm_source_len
    CHECK (utm_source IS NULL OR char_length(utm_source) <= 120),
  CONSTRAINT funnel_events_utm_campaign_len
    CHECK (utm_campaign IS NULL OR char_length(utm_campaign) <= 120)
);

CREATE INDEX IF NOT EXISTS funnel_events_created_step_idx
  ON public.funnel_events (created_at, step);

ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.funnel_events FROM PUBLIC, anon, authenticated;
GRANT INSERT ON TABLE public.funnel_events TO anon, authenticated;
GRANT ALL ON TABLE public.funnel_events TO service_role;

CREATE POLICY funnel_events_insert_anon
  ON public.funnel_events FOR INSERT TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY funnel_events_insert_auth
  ON public.funnel_events FOR INSERT TO authenticated
  WITH CHECK (user_id IS NULL OR user_id = (select auth.uid()));
