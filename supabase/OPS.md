# Ops Supabase — Jogador PRO

Checklist de operação (secrets + crons).

## Secrets

As Edge Functions leem **primeiro** o env do Dashboard e, se vazio, o **Vault** via RPC `vault_secret` (só `service_role`):

| Nome no Dashboard | Nome no Vault | Uso |
|-------------------|---------------|-----|
| `CRON_SECRET` | `cron_secret` | `send-winback`, `send-streak-reminder`, `send-checkout-recovery` + jobs `pg_net` |
| `MERCADOPAGO_WEBHOOK_SECRET` | `mercadopago_webhook_secret` | HMAC `x-signature` do webhook MP |

`cron_secret` está no Vault (criado se faltava). Os jobs `pg_net` usam esse valor. Se `CRON_SECRET` também existir no Dashboard, as functions aceitam **qualquer um dos dois**.

`ADMIN_EMAILS` só existe no Dashboard (não dá para gravar via SQL). Sem ele, `ensure-admin-role` nunca promove ninguém — o painel `/admin` fica inacessível até o dono colar o e-mail confirmado, separado por vírgula.

## Conta admin (painel)

Consulta no Futebol:

```sql
select id, role from profiles where role = 'admin';
```

Resultado: **0 linhas**. Ninguém foi promovido.

`ADMIN_EMAILS` **já está gravado** no Dashboard (Edge Function secret; não dá para ler o valor daqui nem gravar via SQL). O painel está promovível: o dono entra com o e-mail confirmado da allowlist e abre `/admin` — `ensure-admin-role` faz o upsert de `profiles.role = admin`.

Não inventar e-mail, não promover conta `@teste.com` e não colar o endereço neste arquivo.

Webhook MP: copie o secret em Your integrations → Webhooks e grave no Vault (substitui o valor de QA, se houver):

```sql
select vault.create_secret('COLE_O_SECRET_DO_MP', 'mercadopago_webhook_secret');
-- se o nome já existir:
-- select vault.update_secret(id, 'NOVO_VALOR') from vault.secrets where name = 'mercadopago_webhook_secret';
```

Sem `mercadopago_webhook_secret` (Vault) nem `MERCADOPAGO_WEBHOOK_SECRET` (Dashboard) o webhook responde 401.

Outros secrets só no Dashboard → Edge Functions → Secrets:

| Secret | Obrigatório | Uso |
|--------|-------------|-----|
| `MERCADOPAGO_ACCESS_TOKEN` | sim | `process-payment`, `mercadopago-webhook` |
| `MERCADOPAGO_PUBLIC_KEY` | sim (Lovable/Vite) | Brick do checkout; **mesmo app e mesmo modo** que o Access Token |
| `ADMIN_EMAILS` | sim | `ensure-admin-role` |
| `META_CAPI_ACCESS_TOKEN` | sim (ads) | CAPI |
| `META_PIXEL_ID` | opcional | default `3161156880941929` |
| `RESEND_API_KEY` | sim (retenção) | e-mails |
| `RESEND_FROM` | sim | remetente |
| `APP_URL` | sim | links nos e-mails |

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` já são injetados.

Cartão com erro **Invalid credentials** (MP code 17): Public Key (`VITE_MERCADOPAGO_PUBLIC_KEY` / `MERCADOPAGO_PUBLIC_KEY`) e Access Token não são do mesmo aplicativo ou misturam Teste (`TEST-…`) com Produção (`APP_USR-…`). Copie os dois no [painel do MP](https://www.mercadopago.com.br/developers/panel/app) do mesmo bloco.

## Domínio de produção (Meta Ads)

`jogadorprosystem.com` está **NXDOMAIN** (RDAP 404): o nome não tem registro DNS. Sem isso o apex e o `www` não respondem 200 — o site no ar hoje é `https://jogadorprosystem.lovable.app`.

Para o anúncio usar o domínio próprio:

1. Registrar `jogadorprosystem.com` no registrador.
2. No Lovable: Settings → Domains → adicionar `jogadorprosystem.com` (e `www`).
3. Apontar o DNS exatamente como o painel pedir (em geral CNAME de `www` para `jogadorprosystem.lovable.app` e ALIAS/A no apex).
4. Confirmar `GET https://jogadorprosystem.com/` = 200 e `GET /og-cover.jpg` = 200 antes de ligar a campanha.

Até o DNS existir, a URL do anúncio deve ser `https://jogadorprosystem.lovable.app/?utm_source=facebook&utm_medium=cpc&utm_campaign=...`.

Não deixe `META_TEST_EVENT_CODE` setado em produção.

## Crons (pg_cron + pg_net)

1. `send-checkout-recovery-hourly` — `5 * * * *`
2. `send-streak-reminder-daily` — `0 23 * * *` (BRT ~20h)
3. `send-winback-daily` — `10 23 * * *`
4. `expire-pro-access-hourly` — SQL já existente

Header: `Authorization: Bearer <cron_secret do Vault>`.

## Webhook Mercado Pago

`https://ldxetjfmglvxmzaufpgk.supabase.co/functions/v1/mercadopago-webhook`

## Cupons seed

- `PRO10` → 10%
- `AMIGO15` → 15%
