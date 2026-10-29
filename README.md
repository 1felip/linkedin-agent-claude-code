# Agente de LinkedIn para Claude Code

Um assistente pessoal de LinkedIn que roda no seu computador, dentro do [Claude Code](https://code.claude.com/docs/en/overview). Ele analisa e melhora o seu perfil, escreve posts e sugere comentários no feed, sempre adaptado à sua área de atuação. **Nada é publicado ou salvo no LinkedIn sem a sua aprovação explícita.**

Funciona para qualquer profissão: tecnologia, direito, saúde, marketing, finanças, vendas etc.

## O que ele faz

| Comando | O que faz |
| :--- | :--- |
| `/onboarding` | Entrevista rápida (4 perguntas) para adaptar o agente à sua área, objetivo, público e tom de voz. |
| `/analisar-perfil` | Lê seu perfil, mostra uma tabela **Atual vs. Sugerido** (título, Sobre, experiências, competências) e aplica só o que você aprovar. |
| `/criar-post` | Sugere 3 ângulos de post, escreve o texto, gera **imagens em carrossel** (opcional) e publica pela **API oficial do LinkedIn** depois do seu "sim". |
| `/engajar` | Lê até 5 posts relevantes do seu feed e sugere 2 opções de comentário para cada um; envia só os que você escolher. |

## Como funciona por baixo

- **Leitura e edição do perfil e comentários:** um navegador automatizado ([Playwright MCP](https://github.com/microsoft/playwright-mcp)) com o seu login salvo localmente.
- **Publicação de posts:** o script `post_linkedin.mjs` (Node.js puro, sem dependências) usando a [Share on LinkedIn API](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin) oficial.
- **Segurança (*human-in-the-loop*):** antes de qualquer clique em "Salvar", "Comentar" ou "Publicar", o agente mostra o texto exato e espera você confirmar. Sessões de engajamento são limitadas a poucos posts, sem rolagem acelerada nem várias abas.

---

## Passo a passo de instalação

### 1. Pré-requisitos
- **Node.js 18 ou mais recente**: [nodejs.org](https://nodejs.org/). Confira com `node --version`.
- **Claude Code**: `npm install -g @anthropic-ai/claude-code`. Confira com `claude --version`.
- Uma conta no LinkedIn.

### 2. Baixe o projeto
Clique em **Use this template** (no topo desta página) para criar a sua cópia, ou clone direto:

```bash
git clone https://github.com/1felip/linkedin-agent-claude-code.git
cd linkedin-agent-claude-code
```

### 3. Abra o Claude Code na pasta
```bash
claude
```

### 4. Peça a instalação
Cole no chat:

```text
Leia o CLAUDE.md e execute a Seção 0: instale o projeto, faça meu onboarding personalizado e me guie na configuração da API do LinkedIn.
```

O agente vai, em sequência:

1. **Criar os arquivos locais**: `.mcp.json` (navegador automatizado, ajustado ao seu sistema operacional) e os arquivos privados de memória (`perfil_atual.md`, `fila_posts.md`, `historico_engajamento.md`).
2. **Fazer o onboarding**: 4 perguntas sobre a sua área, objetivo, público-alvo e tom de voz. Se preferir, passe o link do seu perfil e ele pré-preenche as respostas. Com isso ele reescreve a Seção 1 do `CLAUDE.md`.
3. **Configurar a API do LinkedIn** (passo a passo abaixo).

> Depois que o `.mcp.json` for criado, feche e abra o Claude Code de novo (`claude`) para o navegador automatizado ser carregado. Na primeira vez que ele abrir o LinkedIn, faça login **você mesmo** na janela que aparecer; o login fica salvo na pasta `.playwright-linkedin-profile/`.

### 5. Configurar a API oficial do LinkedIn (≈10 minutos, uma vez só)

1. **Tenha uma LinkedIn Page.** O app de desenvolvedor precisa estar ligado a uma página de empresa da qual você é administrador. Se não tiver, crie em [linkedin.com/company/setup/new](https://www.linkedin.com/company/setup/new/) (pode ser uma página simples com o seu nome ou marca).
2. **Crie o app** em [linkedin.com/developers/apps](https://www.linkedin.com/developers/apps) → **Create app**:
   - O nome **não pode conter a palavra "LinkedIn"**.
   - Em *LinkedIn Page*, se a página nova não aparecer pelo nome, cole a URL com o ID numérico (`https://www.linkedin.com/company/123456789/`) e **confira o ID**: existem páginas com o mesmo nome, e esse vínculo não pode ser desfeito.
   - O logo é obrigatório (imagem quadrada de pelo menos 100px).
3. **Peça os produtos** na aba **Products** → **Request access** em:
   - **Share on LinkedIn**
   - **Sign In with LinkedIn using OpenID Connect**

   Os dois costumam ser liberados na hora.
4. **Gere o token** no [gerador de token](https://www.linkedin.com/developers/tools/oauth/token-generator): selecione o seu app, marque `openid`, `profile` e `w_member_social`, clique em **Request access token** e autorize.
5. **Cole o token no chat do Claude Code.** O agente grava no `.env`, descobre o seu identificador (`node post_linkedin.mjs --whoami`) e faz um teste sem publicar nada (`--dry-run`).

> O token vale cerca de **60 dias**. Quando uma publicação falhar com erro **401**, gere outro token no mesmo gerador e cole no chat.

---

## Uso no dia a dia

1. Abra o terminal na pasta do projeto e rode `claude`.
2. Digite o comando desejado:
   - `/analisar-perfil`: comece por aqui.
   - `/criar-post` ou `/criar-post <tema>`: ex. `/criar-post como automatizei meu controle financeiro`.
   - `/engajar`: sessão curta de comentários no feed.
   - `/onboarding`: refaz a personalização quando seu objetivo ou cargo mudar.
3. Leia as sugestões, aprove (`sim`, `aprovado`, `pode postar`), peça ajustes ou recuse.

### Posts com imagens (carrossel)
Quando o post for um guia ou tiver passos, o `/criar-post` oferece gerar slides verticais (1080×1350) a partir de `templates/slides-modelo.html`:

1. O agente copia o modelo para `midia/<nome-do-post>/slides.html` e escreve um slide por ideia do post (capa, passos, fechamento) com o **seu nome** no rodapé.
2. Renderiza cada slide como PNG usando o mesmo navegador automatizado (Playwright MCP) e revisa visualmente antes de te mostrar.
3. Você pede ajustes (ex.: "título mais chamativo na capa") até aprovar.
4. O script envia as imagens e publica tudo junto. Várias imagens aparecem no LinkedIn como **carrossel** ("1 de 8").

Para mudar cores ou fontes, edite as variáveis no topo de `templates/slides-modelo.html` (`--bg`, `--orange`, `--orange-2`...). A pasta `midia/` fica fora do Git.

### Publicar manualmente pelo terminal (opcional)
```bash
node post_linkedin.mjs --whoami                                   # confere o token
node post_linkedin.mjs --file post_aprovado.txt --dry-run         # pré-visualiza, não publica
node post_linkedin.mjs --file post_aprovado.txt                   # publica
node post_linkedin.mjs --file post.txt --link "https://site.com" --link-title "Título"   # post com link
node post_linkedin.mjs --file post.txt --image capa.png --image passo1.png --dry-run     # post com imagens (até 9; PNG, JPG ou GIF)
```

Com `--image`, o script registra o upload de cada imagem na API, envia os arquivos e só então publica. Se algum envio falhar, ele para **antes** de publicar.

---

## Privacidade: o que fica só no seu computador

Estes arquivos estão no `.gitignore` e **nunca** devem ser enviados ao GitHub ou compartilhados:

| Arquivo / pasta | Conteúdo |
| :--- | :--- |
| `.env` | Seu token de acesso ao LinkedIn |
| `.playwright-linkedin-profile/` | Cookies e sessão de login do navegador |
| `.playwright-mcp/` | Capturas e registros das páginas lidas |
| `midia/` | Slides e imagens gerados para os seus posts |
| `perfil_atual.md`, `fila_posts.md`, `historico_engajamento.md`, `post_aprovado.txt` | Seu perfil, rascunhos e histórico |
| `.mcp.json` | Configuração local do navegador (gerada na instalação) |

Atenção: depois do onboarding, a **Seção 1 do `CLAUDE.md`** passa a conter dados do seu perfil. Se for compartilhar a sua cópia, restaure essa seção para o texto `[NÃO CONFIGURADO]` antes.

## Estrutura do projeto

```
CLAUDE.md                  # Cérebro do agente: instalação, regras de segurança e comandos
post_linkedin.mjs          # Publicador via API oficial: texto, link ou imagens (Node.js, sem dependências)
.claude/commands/          # Slash commands: onboarding, analisar-perfil, criar-post, engajar
templates/slides-modelo.html  # Modelo de slides 1080×1350 para posts com imagens
.env.example               # Modelo das credenciais
.gitignore                 # Protege seus dados pessoais
```

## Limites e boas práticas

- Use com moderação: o LinkedIn restringe automações agressivas. O agente processa no máximo 5 a 8 posts por sessão de engajamento e nunca age sem aprovação.
- Revise sempre o texto final: o agente não inventa números nem experiências, mas só você sabe o que é verdade sobre a sua carreira.
