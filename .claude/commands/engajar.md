Inicie uma sessão assistida de engajamento estratégico no LinkedIn seguindo as regras do `CLAUDE.md`:

1. Use o Playwright MCP para navegar até `https://www.linkedin.com/feed/` (ou para a URL de um perfil/post específico caso eu tenha informado no argumento: `$ARGUMENTS`).
2. Capture a árvore de acessibilidade com `browser_snapshot` (não faça scroll acelerado nem abra várias abas).
3. Selecione até 5 publicações orgânicas (ignore posts patrocinados/anúncios) alinhadas à minha Área de Atuação e aos meus Pilares de Conteúdo que ainda não constem em `historico_engajamento.md`. Nunca processe mais de 8 posts na sessão.
4. Para cada post selecionado, mostre no terminal:
   - **Número, Autor e Resumo** (em até 2 linhas)
   - **Opção A (Complemento Prático):** Comentário de 2 a 3 frases acrescentando um ponto de vista ou experiência concreta da minha área.
   - **Opção B (Pergunta Instigante):** Comentário curto com uma pergunta aberta que estimule resposta do autor.
5. PARE e aguarde minha escolha (ex: "1A, 2 pular, 3B").
6. Apenas para os comentários que eu aprovar explicitamente, preencha o campo de comentário correspondente via Playwright MCP, envie o comentário e registre a interação em `historico_engajamento.md`.
