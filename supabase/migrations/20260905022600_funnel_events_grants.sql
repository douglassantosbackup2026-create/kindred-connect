REVOKE ALL ON TABLE public.funnel_events FROM PUBLIC, anon, authenticated;
GRANT INSERT ON TABLE public.funnel_events TO anon, authenticated;
GRANT ALL ON TABLE public.funnel_events TO service_role;
