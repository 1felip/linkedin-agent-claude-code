Execute (ou refaça) o onboarding de personalização do agente seguindo a **Etapa B da Seção 0** do `CLAUDE.md`:

1. Leia a Seção 1 do `CLAUDE.md` e mostre o que está configurado hoje (ou avise que ainda está `[NÃO CONFIGURADO]`).
2. Ofereça ler um PDF exportado do LinkedIn nesta pasta (ou o perfil via Playwright MCP) para pré-preencher as respostas.
3. Faça as 4 perguntas no chat:
   1. Qual é a sua área de atuação e cargo/especialidade atual?
   2. Qual é o seu principal objetivo no LinkedIn hoje?
   3. Quem é o seu público-alvo ideal?
   4. Qual tom de voz combina mais com você?
4. Com base nas respostas, reescreva a Seção 1 do `CLAUDE.md`: status configurado, nome/cargo, objetivo, público-alvo, 3 Pilares de Conteúdo específicos do nicho e regras de Tom de Voz personalizadas. Mostre o texto novo antes de salvar.
5. Verifique se o `.env` existe e contém `LINKEDIN_ACCESS_TOKEN` e `LINKEDIN_PERSON_URN`. Se faltar algo, ofereça executar a **Etapa C da Seção 0** (configuração guiada da API).
