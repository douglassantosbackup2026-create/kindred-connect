# Migrar o app para o novo projeto Supabase (ldxetjfmglvxmzaufpgk)

## Situação confirmada

- O código ainda aponta para o projeto antigo: `src/integrations/supabase/client.ts` traz a URL/chave de `zuqjyxcjftrtrhqxuvfq` e `supabase/config.toml` usa `project_id = "zuqjyxcjftrtrhqxuvfq"`.
- A integração ativa do Lovable é o projeto `ldxetjfmglvxmzaufpgk`, e ele está **vazio**: nenhuma tabela, nenhum bucket, nenhuma função de banco além do gatilho padrão de RLS. Os tipos gerados (`src/integrations/supabase/types.ts`) já refletem esse banco vazio, então hoje nada do app funciona contra ele.
- O histórico do schema existe em `supabase/migrations/` (24 migrações) e as Edge Functions estão em `supabase/functions/` (pagamentos, webhooks Mercado Pago/Stripe, Meta CAPI, e-mails/crons).

Importante: essa mudança **não copia os dados** (usuários, assinaturas, progresso) do banco antigo. O novo projeto começa zerado.

## Passos

1. **Recriar o schema no novo banco**: aplicar, em uma migração consolidada, tudo o que as 24 migrações existentes constroem — tabelas de perfis, papéis/admin, assinaturas e entitlements, cupons/pausa, treinos e vídeos, sugestões, leads e intenções de checkout — com os GRANTs e as políticas de RLS equivalentes, além das funções e gatilhos de apoio (papel de admin, acesso pago, updated_at) e das extensões usadas por crons.
2. **Apontar o app para o novo projeto**: atualizar o cliente Supabase gerado e `supabase/config.toml` para `ldxetjfmglvxmzaufpgk`, confirmando as variáveis de ambiente (`SUPABASE_URL`, chave publicável, service role) revinculadas ao novo projeto.
3. **Reimplantar as Edge Functions** no novo projeto, mantendo os mesmos nomes e as flags de `verify_jwt` do config.
4. **Reconfigurar os segredos e integrações** que vivem no lado Supabase: Mercado Pago, Stripe, Meta CAPI, envio de e-mails, `CRON_SECRET` e os agendamentos pg_cron. Vou listar exatamente o que precisa ser recolocado; os valores que você já tem em mãos podem ser salvos com segurança.
5. **Reativar autenticação**: confirmar provedor de e-mail/senha, URLs de redirecionamento (site publicado e preview) e o fluxo de recuperação de senha.
6. **Validar ponta a ponta**: cadastro/login, criação de perfil com CPF/celular, seleção de plano e abertura do checkout, área logada e painel admin.

## Detalhes técnicos

- Um usuário administrador precisará ser recriado no novo banco depois do primeiro cadastro (a tabela de papéis fica separada do perfil, por segurança).
- Assinaturas ativas no projeto antigo não são reconhecidas no novo até que os dados sejam migrados ou recriados; se você quiser migrar os usuários e pagamentos existentes, isso é um trabalho adicional que posso planejar em seguida.
- Nenhuma alteração de layout ou de regra de negócio está incluída aqui.
