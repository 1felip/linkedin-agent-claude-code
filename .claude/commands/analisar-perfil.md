Analise meu perfil do LinkedIn seguindo rigorosamente as regras do `CLAUDE.md`:

1. Verifique se existe um arquivo PDF exportado do LinkedIn neste diretório ou use o Playwright MCP (`browser_navigate` para `https://www.linkedin.com/in/me/` seguido de `browser_snapshot`) para ler meu perfil atual.
2. Atualize o arquivo `perfil_atual.md` com os textos atuais de:
   - Título (Headline)
   - Sobre (About)
   - Experiências recentes e Competências em destaque
3. Avalie Headline, Sobre e Experiências frente à Área de Atuação, ao Público-Alvo e aos Pilares de Conteúdo definidos na Seção 1 do `CLAUDE.md`.
4. Apresente uma tabela Markdown **Atual vs. Sugerido** com a justificativa de SEO e posicionamento para o meu mercado.
5. PARE e pergunte quais alterações eu aprovo (ex: "Deseja aplicar a nova Headline ou o novo Sobre?").
6. Somente após minha aprovação explícita para um item, abra o modal de edição no navegador via Playwright MCP, preencha o campo com o texto aprovado e peça minha confirmação final antes de clicar no botão "Salvar".
7. Registre em `perfil_atual.md` as otimizações aprovadas e aplicadas, com data.
