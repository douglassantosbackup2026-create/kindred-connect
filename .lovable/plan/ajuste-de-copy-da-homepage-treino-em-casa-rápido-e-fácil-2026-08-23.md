# Ajuste de copy da homepage: treino em casa, rápido e fácil

## Objetivo

Deixar a homepage falando de forma consistente para quem quer evoluir no futebol sem depender de campo, escolinha ou muito tempo. A mensagem central é: **"Evolua no futebol treinando em casa, em minutos por dia"**, com ainda um gancho de urgência/desafio: **"Sem campo, sem desculpa"**.

## O que mudar

Todas as mudanças são no arquivo `src/data/campanha-copy.ts`. Não mexeremos em cores, layout, imagens ou componentes — só no texto. Ajustes pontuais:

1. **Hero (headline, subheadline, CTA)**
   - Título principal: reforçar que dá para treinar em casa e em poucos minutos.
   - Subtítulo: acabar com a objeção "não tenho tempo nem lugar".
   - CTA primário: manter "Quero ser Jogador PRO" ou testar algo mais direto como "Começar a treinar em casa".
   - Hint e preço: manter a ancoragem, mas ligar ao valor de treinar todo dia.

2. **Faixa de social proof / urgência**
   - Trocar "Sistema diário para quem treina sozinho e quer evoluir no jogo" por algo que mencione casa e rapidez.

3. **Seção "Problema"**
   - Adaptar os bullets para cenários de quem treina sozinho em casa: falta de direção, falta de tempo, falta de campo, cansaço.
   - Quebra: "O problema não é você. É a falta de um plano que caiba na sua rotina."

4. **Seção "Solução"**
   - Deixar claro que o plano é feito para ser feito em casa, com pouco espaço e sem equipamento caro.
   - Passos: algo como "Abre o app → segue o treino do dia → evolui em minutos".

5. **Seção "Como funciona"**
   - Plano estruturado: reforçar que já vem pronto, sem precisar criar nada.
   - Tempo: deixar "10 a 20 minutos" ainda mais explícito como vantagem.
   - Acesso: manter celular/computador, mas destacar "na sua casa".

6. **Seção "Veja por dentro"**
   - Legenda dos prints pode ganhar uma palavra sobre praticidade.

7. **Modo Rápido**
   - Já é a seção perfeita para essa mensagem; só reforçar o gancho "sem sair de casa".

8. **Benefícios e diferencial**
   - Benefícios: manter evolução técnica/física, mas incluir "treino que cabe na rotina".
   - Diferencial: reforçar que não precisa de campo, nem de academia.

9. **Depoimentos**
   - Selecionar depoimentos que já mencionam praticidade/casa/celular, se possível.

10. **Oferta / planos**
    - Manter preços (R$47 / R$147 / R$197).
    - Legenda dos cards pode ganhar um destaque de "acesso imediato no celular".

11. **FAQ**
    - Pergunta sobre campo/material já está boa; talvez adicionar ou reforçar: "E se eu não tiver espaço em casa?".

12. **Seção final de urgência**
    - Fechar com gancho de "sem desculpa": "Você pode continuar sem treinar... ou começar hoje em casa, em minutos".

## Detalhes técnicos

- Arquivo principal: `src/data/campanha-copy.ts`.
- Não alterar `src/components/LandingPage.tsx`, a menos que seja necessário adicionar uma nova linha de copy (o componente já consome tudo do objeto `CAMPANHA`).
- Não alterar design, imagens, vídeos ou cores.
- Verificar se o `as const` no final do arquivo continua válido e se nenhuma referência tipada quebra.
- Rodar typecheck após as alterações.

## Critério de pronto

- A landing page lê como um produto para treinar em casa, rapidamente, sem complicação.
- Nenhuma mensagem contradiz a ideia de "campo/material obrigatório".
- Typecheck limpo.
