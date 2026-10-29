Crie e publique um novo post no LinkedIn seguindo o fluxo seguro do `CLAUDE.md`:

1. Considere o tema ou briefing informado (`$ARGUMENTS`). Se nenhum tema foi passado, consulte `fila_posts.md` e `historico_engajamento.md`.
2. Sugira **3 ângulos de postagem** numerados e adaptados ao meu nicho: 1 Estudo de Caso / Bastidor, 1 Guia Prático passo a passo, 1 Opinião / Análise de Mercado.
3. Após minha escolha, redija o post completo: gancho forte nas 2 primeiras linhas, parágrafos curtos, sem clichês corporativos, chamada para conversa no final e até 3 hashtags. Registre o rascunho em `fila_posts.md` (seção "Rascunhos em Revisão").
4. Salve o texto em `post_aprovado.txt`, execute `node post_linkedin.mjs --file post_aprovado.txt --dry-run`, mostre o preview no terminal e pergunte: **"Aprova a publicação imediata via API ou deseja editar?"**
5. Somente após receber aprovação explícita (`sim`, `aprovado` ou `pode postar`), execute:
   `node post_linkedin.mjs --file post_aprovado.txt`
6. Atualize `fila_posts.md` movendo o post para a seção "Posts Publicados", com a data e o URN/link retornado.
