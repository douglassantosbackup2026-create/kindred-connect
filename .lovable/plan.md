# Auditoria técnica e plano de refatoração — Jogador Pro

Observação: parte do pedido cita itens de outro projeto (`ai-review`, `competitors`, `generate-report`, `campaign-ai-audit`, agências/clientes). Este projeto não tem essas rotas nem essas funções — o plano abaixo cobre o mesmo tipo de rigor aplicado ao que realmente existe aqui (treinos, checkout Mercado Pago, Meta CAPI, painel admin, crons de e-mail).

## Diagnóstico resumido

O projeto está acima da média: error boundaries em quase todas as rotas, validação Zod nas server functions, autorização diferenciada nas edge functions (JWT, `is_admin`, segredo de cron, HMAC do webhook), `service_role` só em módulo server-only e CSP/headers configurados. Os ganhos estão em fechar lacunas pontuais, remover repetição e reduzir casts.

Achado mais relevante (bloqueante para o painel): a função que promove admin depende do segredo `ADMIN_EMAILS`, que **não está configurado** neste projeto Supabase. Hoje ninguém consegue virar administrador, então todo o painel `/admin` fica inacessível.

## Tarefas

### 1. Segurança e autorização (prioridade alta)
- Configurar o segredo `ADMIN_EMAILS` e promover a conta do dono; validar acesso a `/admin`.
- Remover do deploy as funções desativadas `create-checkout` e `stripe-webhook` (só respondem 410) para reduzir superfície pública.
- Checklist por edge function (corpo validado, quem pode chamar, resposta de erro sem vazar detalhe) — registrar o resultado como comentário no topo de cada função.
- Rate limit nas server functions de escrita que ainda não têm (`treinos.functions.ts`), no mesmo molde já usado em sugestões/leads.
- Padronizar validação com Zod também em `treinos.functions.ts` (hoje validação manual equivalente).
- Confirmar que os dois pontos de `dangerouslySetInnerHTML` (JSON-LD do FAQ e script do root) só recebem conteúdo estático — e deixar isso explícito em comentário.
- CSRF: modelo é bearer token (sem cookie de sessão em escrita), portanto sem ação; documentar a decisão na memória de segurança junto do `unsafe-inline` do CSP.

### 2. Erros e feedback ao usuário
- Extrair `getErrorMessage(e, fallback)` para `src/lib/utils.ts` e substituir as 13 repetições de `e instanceof Error ? e.message : "..."`.
- Envolver as leituras diretas de Supabase sem tratamento em `auth.tsx` e `progresso.tsx`, com mensagem ao usuário em vez de tela de erro.
- Adicionar `notFoundComponent` nas duas rotas que ainda não têm (`planos`, `campanha`).
- Manter log server-side sem expor detalhe de provedor no cliente.

### 3. Código morto
- Remover `buscarRegistro` em `src/lib/treino-videos.ts` (nunca chamada) e o `logado` não usado em `bem-vindo-pro.tsx`.
- Ligar regra de lint para variáveis/imports não usados, para não voltar a acumular.
- Não há componentes órfãos, estados mortos nem blocos comentados sem explicação — nada a remover nesses itens.

### 4. Duplicação (DRY)
- Migrar `admin.index`, `admin.sugestoes` e `admin.videos` para o hook `useAdminTable`, com variante que devolva o erro em texto (para exibição inline) além do toast.
- Criar helper tipado para acesso a propriedades globais do navegador, eliminando os três casts repetidos de `window` (`MercadoPagoCheckout`, `RewardBurst`, `meta-pixel`).

### 5. Tipagem
- Trocar `role: string` por união `"admin" | "user"` e `plano` pelo tipo já existente de plano em `src/lib/admin.ts`.
- `PESO_NIVEL` em `biblioteca.tsx` passa a `Record<Nivel, number>`.
- Reduzir o duplo cast em `supabase-write.ts` com um tipo de tabela restrito às tabelas realmente escritas pelo cliente (perde-se menos checagem de coluna).
- Nomear e exportar os tipos de props inline (ex.: `VideoRow`), mantendo a convenção `type` já adotada no projeto.
- `any` restante está só em `routeTree.gen.ts` (gerado) — não tocar.

### 6. Performance
- `useMemo` para filtro/ordenação da biblioteca e para os cálculos de XP/patente/últimos 7 dias do painel.
- `useCallback` nos handlers de admin (`toggleAssinante`, `toggleRole`, `recarregar`) e extrair linhas de tabela em componentes memoizados.
- `width`/`height` nas imagens da landing (`PreviewTreinos`, `AppShowcase`) para eliminar deslocamento de layout; recomprimir `cat-explosao.jpg` (~118 KB, 4x maior que as irmãs).
- Virtualização: não é necessária hoje (listas limitadas a 20–200 itens); garantir limite/paginação na busca de usuários do admin antes que isso mude.

### 7. Testes e observabilidade
- Testes de contrato mockados para os fluxos de pagamento: `process-payment` (limite de parcelas por plano, valores) e `mercadopago-webhook` (assinatura válida/inválida, idempotência).
- Teste do cálculo de acesso PRO e do fluxo de cupom.
- Painel simples de erros: manter captura global existente e registrar eventos de falha de pagamento em `payment_events` para diagnóstico.

### 8. Produto, fluxo e navegação (visão sênior)
- **Ativação**: hoje o usuário novo passa por cadastro → onboarding → app. Sugestão: primeiro treino jogável antes de exigir plano, com o guia de execução já pronto — reduz atrito e melhora conversão de anúncio.
- **Checkout**: mostrar parcelamento e comparação de planos direto no passo de pagamento, com recuperação de carrinho (já há `checkout_intents` e função de recuperação) disparando também no app, não só por e-mail.
- **Retenção**: streak e lembrete existem; falta uma tela de "próximo treino recomendado" fixa na home e notificação semanal do ranking.
- **Admin**: busca única com filtros salvos e ação rápida de estender acesso PRO (hoje exige alternar assinante manualmente).
- **SEO/landing**: manter H1 único por rota e checar títulos/descrições próprios em cada página de conteúdo.

## Ordem sugerida de execução

1. Segurança (item 1) — desbloqueia o admin e reduz superfície.
2. Erros e código morto (itens 2 e 3) — baixo risco, ganho imediato.
3. DRY e tipagem (itens 4 e 5).
4. Performance (item 6).
5. Testes (item 7).
6. Melhorias de produto (item 8), uma por vez com medição.
