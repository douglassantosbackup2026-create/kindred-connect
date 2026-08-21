# Corrigir erros do console após a migração do Supabase

## O que os três erros significam

**1. Login retornando 400 (`/auth/v1/token?grant_type=password`) — é o único erro real**

Verifiquei o banco novo: existem 2 contas de teste. A primeira (`teste1@…`, criada 03:26) está **sem e-mail confirmado** e nunca conseguiu entrar; a segunda (`teste2@…`, criada 03:27) foi confirmada na hora e logou normalmente.

O fluxo de checkout faz cadastro e, em seguida, tenta abrir a sessão na hora para liberar o Pix. Se o projeto Supabase novo estiver exigindo confirmação de e-mail, esse login imediato devolve 400 ("Email not confirmed") e o checkout trava. É a configuração de Auth do projeto novo que precisa ficar igual à do antigo — não é bug de código.

**2. `[Meta Pixel] Duplicate Pixel ID`** — aviso, não erro. O pixel é inicializado uma vez no carregamento da página e reinicializado com os dados de Advanced Matching (e-mail/telefone) quando a sessão hidrata. O rastreamento funciona; o Meta só reclama do segundo `init`.

**3. `Content Security Policy … CameraPlainVariable.woff2`** — vem do editor/preview da Lovable, não do seu app. Não aparece no site publicado e não há o que corrigir no projeto.

## Plano

1. **Auth do projeto novo (`ldxetjfmglvxmzaufpgk`)**
   - Desligar a confirmação obrigatória de e-mail (ou mantê-la ligada, se você preferir — mas aí o checkout precisa avisar o usuário em vez de tentar logar direto).
   - Conferir Site URL e Redirect URLs (site publicado + preview).
   - Apagar as contas de teste `teste1`/`teste2` depois do teste.

2. **Meta Pixel — remover o aviso de duplicidade**
   - Fazer o Advanced Matching não disparar um segundo `init` quando não houver nenhum dado novo de identidade (hoje ele reinicializa mesmo em visita anônima logo após o `init` do carregamento).

3. **Validação**
   - Refazer um cadastro novo no checkout e confirmar: sessão aberta na hora, sem 400, perfil criado e intenção de checkout registrada.

## Detalhes técnicos

- `src/lib/checkout.ts` → `garantirSessaoAposCadastro` já trata "email not confirmed"; o ajuste é de configuração, não de código.
- `src/lib/meta-pixel.ts` → `applyAdvancedMatching` chama `fbq("init", …)` sempre que a chave muda; o ajuste é sair cedo quando não há e-mail/telefone/external_id.
- Fora do escopo: o aviso de CSP da fonte (infra do preview da Lovable).
