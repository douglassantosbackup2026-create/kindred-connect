-- Garante secret dos crons HTTP e agenda recovery/streak/winback no projeto Futebol.
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM vault.secrets WHERE name = 'cron_secret') THEN
    PERFORM vault.create_secret(
      encode(extensions.gen_random_bytes(32), 'hex'),
      'cron_secret',
      'Bearer Authorization for send-* Edge Functions'
    );
  END IF;
END $$;

DO $$
DECLARE
  base_url text := 'https://ldxetjfmglvxmzaufpgk.supabase.co/functions/v1';
  jid bigint;
BEGIN
  PERFORM private.cron_edge_headers();

  SELECT jobid INTO jid FROM cron.job WHERE jobname = 'send-checkout-recovery-hourly';
  IF jid IS NOT NULL THEN PERFORM cron.unschedule(jid); END IF;
  PERFORM cron.schedule(
    'send-checkout-recovery-hourly',
    '5 * * * *',
    format(
      $cron$select net.http_post(
        url := %L,
        headers := private.cron_edge_headers(),
        body := '{}'::jsonb
      );$cron$,
      base_url || '/send-checkout-recovery'
    )
  );

  SELECT jobid INTO jid FROM cron.job WHERE jobname = 'send-streak-reminder-daily';
  IF jid IS NOT NULL THEN PERFORM cron.unschedule(jid); END IF;
  PERFORM cron.schedule(
    'send-streak-reminder-daily',
    '0 23 * * *',
    format(
      $cron$select net.http_post(
        url := %L,
        headers := private.cron_edge_headers(),
        body := '{}'::jsonb
      );$cron$,
      base_url || '/send-streak-reminder'
    )
  );

  SELECT jobid INTO jid FROM cron.job WHERE jobname = 'send-winback-daily';
  IF jid IS NOT NULL THEN PERFORM cron.unschedule(jid); END IF;
  PERFORM cron.schedule(
    'send-winback-daily',
    '10 23 * * *',
    format(
      $cron$select net.http_post(
        url := %L,
        headers := private.cron_edge_headers(),
        body := '{}'::jsonb
      );$cron$,
      base_url || '/send-winback'
    )
  );
END $$;

REVOKE ALL ON TABLE public.lifecycle_emails FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.lifecycle_emails TO service_role;
