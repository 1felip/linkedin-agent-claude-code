Crie e publique um novo post no LinkedIn seguindo o fluxo seguro do `CLAUDE.md`:

1. Considere o tema ou briefing informado (`$ARGUMENTS`). Se nenhum tema foi passado, consulte `fila_posts.md` e `historico_engajamento.md`.
2. Sugira **3 ângulos de postagem** numerados e adaptados ao meu nicho: 1 Estudo de Caso / Bastidor, 1 Guia Prático passo a passo, 1 Opinião / Análise de Mercado.
3. Após minha escolha, redija o post completo: gancho forte nas 2 primeiras linhas, parágrafos curtos, sem clichês corporativos, chamada para conversa no final e até 3 hashtags. Registre o rascunho em `fila_posts.md` (seção "Rascunhos em Revisão").
4. **Imagens (opcional; ofereça quando o post for um guia ou tiver passos):** gere slides verticais 1080×1350 a partir de `templates/slides-modelo.html` (copie para `midia/<nome-do-post>/slides.html`, troque o conteúdo e o nome do autor; não invente informações que não estão no post). Renderize cada `<section class="slide">` com o Playwright MCP (`browser_run_code_unsafe`: nova página, viewport 1080×1350, `goto file:///...`, aguarde `document.fonts.ready`, `locator('#sN').screenshot`). Revise cada PNG visualmente (corte, sobreposição, rodapé) antes de mostrar. Máximo de 9 imagens; várias imagens aparecem como carrossel.
5. Salve o texto em `post_aprovado.txt`, execute `node post_linkedin.mjs --file post_aprovado.txt [--image midia/.../slide-1.png ...] --dry-run`, mostre o preview no terminal e pergunte: **"Aprova a publicação imediata via API ou deseja editar?"**
6. Somente após receber aprovação explícita (`sim`, `aprovado` ou `pode postar`), execute o mesmo comando sem `--dry-run`.
7. Atualize `fila_posts.md` movendo o post para a seção "Posts Publicados", com a data e o URN/link retornado.
