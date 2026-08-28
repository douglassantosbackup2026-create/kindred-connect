# Copy da homepage para público frio (Meta Ads) — baseada nos padrões dos canais de futebol

## O que as imagens mostram

Os títulos/thumbs que estouram views usam sempre a mesma fórmula:

- Linguagem literal e de busca: "TREINO FÍSICO PARA JOGADOR", "TREINO EM CASA PARA JOGADOR", "TREINO DE FUTEBOL EM CASA, SEM SAIR DE CASA".
- Números na frente: "5 DRIBLES", "10 EXERCÍCIOS DE AGILIDADE", "TOP 7", "60 DRIBLES", "5 DICAS DE CHUTE".
- Habilidade específica, não conceito: drible, domínio, chute, passe, agilidade, força, core, pliometria.
- Dor crua: "COMO DEIXAR DE SER RUIM NO FUTEBOL".
- Prova de referência: Neymar, CR7, Ronaldinho — o jogador quer treinar como o ídolo.
- Promessa de tempo/lugar: "sem sair de casa", "dia 3/5", rotina.

Nossa homepage hoje fala em "jornada guiada", "mesociclos", "Fundação/Domínio/Potência/Elite", "microtreinos". Isso é linguagem de produto — funciona para quem já conhece, mas para público frio no Meta é abstrato e não bate com a forma como esse público pensa ("quero driblar melhor", "quero treinar em casa").

## O que muda

Tudo em `src/data/pro3-copy.ts` (a homepage já lê 100% desse arquivo). Sem mudança de layout, exceto uma seção nova.

1. **Headline mais literal e específica**
   Trocar "TREINE EM CASA, EVOLUA COMO JOGADOR PRO" por uma linha no vocabulário do público, ex.:
   "TREINO DE FUTEBOL EM CASA / PARA DRIBLAR, DOMINAR / E CHUTAR MELHOR"
   Sub: promessa de tempo + lugar + habilidade ("15 minutos por dia, sem campo e sem academia").

2. **Bullets viram habilidades com número**
   De "Mais domínio / Mais dribles" para o formato dos vídeos campeões:
   "Dribles que funcionam no jogo", "Domínio e primeiro toque", "Chute com força e direção", "Agilidade e explosão", "Físico para aguentar os 90 minutos".

3. **Seção "PROBLEMA" com a dor crua**
   Título no tom de "Como deixar de ser ruim no futebol": "Você treina, treina e continua o mesmo jogador?". Bullets já estão bons — ajusto 2 para linguagem mais direta.

4. **Nova seção: "O QUE VOCÊ VAI TREINAR"** (entre o hero e o problema)
   Grade de 6 blocos no formato de thumbnail: DRIBLE · DOMÍNIO · CHUTE · PASSE · AGILIDADE · FORÇA E CORE, cada um com uma linha do tipo "10 exercícios de agilidade para jogador". É a ponte entre o que o público frio busca no YouTube e o que o app entrega.

5. **Traduzir o jargão**
   "4 mesociclos" → "4 fases: base, controle de bola, explosão e nível de jogo". "Microtreinos" → "treinos de 10 a 20 minutos". Manter os nomes internos só onde reforçam progressão.

6. **Objeção de público frio no FAQ**
   Adicionar: "Preciso de bola/espaço?", "Serve pra quem é iniciante?", "Funciona pra quem já joga em time?" e "Tenho 14 anos, posso?".

7. **CTA mais concreto**
   "Quero ser Jogador PRO" → "Quero começar a treinar hoje" (o secundário continua "Ver planos").

## Detalhes técnicos

- Arquivo principal: `src/data/pro3-copy.ts`.
- `src/components/Pro3LandingPage.tsx`: só para renderizar a nova seção de habilidades (mesmo padrão de `Section` + grid já usado no bloco "CONTEÚDO").
- Nenhum número de prova social novo é inventado: mantenho 2.469 jogadores, 52 semanas, garantia de 14 dias e os preços atuais.
- Sem menção a Neymar/CR7 como endosso (risco de direito de imagem) — uso a ideia ("treine os fundamentos dos craques") sem afirmar associação.
- Head/SEO da rota `/` atualizado para bater com a nova headline.
