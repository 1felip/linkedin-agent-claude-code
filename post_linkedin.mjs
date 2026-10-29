#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const idx = line.indexOf('=');
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && !process.env[key]) process.env[key] = val;
  }
}

async function apiRequest(url, token, method = 'GET', payload = null) {
  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Restli-Protocol-Version': '2.0.0',
      'Content-Type': 'application/json',
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    console.error(`[ERRO HTTP ${res.status}] Falha em ${url}:\n`, text);
    process.exit(1);
  }
  return { status: res.status, headers: res.headers, data };
}

async function getPersonUrn(token) {
  const { data } = await apiRequest('https://api.linkedin.com/v2/userinfo', token, 'GET');
  if (!data.sub) {
    console.error("[ERRO] Campo 'sub' ausente em /v2/userinfo. Verifique os escopos openid e profile.");
    process.exit(1);
  }
  return { urn: `urn:li:person:${data.sub}`, name: data.name || 'Usuário', email: data.email || '' };
}

async function main() {
  loadEnv();
  const args = process.argv.slice(2);
  const isWhoami = args.includes('--whoami');
  const isDryRun = args.includes('--dry-run');
  const fileIdx = args.indexOf('--file');
  const textIdx = args.indexOf('--text');
  const linkIdx = args.indexOf('--link');
  const titleIdx = args.indexOf('--link-title');

  const token = (process.env.LINKEDIN_ACCESS_TOKEN || '').trim();
  if (!token && !isDryRun) {
    console.error('[ERRO] Configure LINKEDIN_ACCESS_TOKEN no arquivo .env.');
    process.exit(1);
  }

  if (isWhoami) {
    const info = await getPersonUrn(token);
    console.log(`Autenticado com sucesso: ${info.name} (${info.email})`);
    console.log(`LINKEDIN_PERSON_URN=${info.urn}`);
    return;
  }

  let postText = '';
  if (fileIdx !== -1 && args[fileIdx + 1]) {
    postText = fs.readFileSync(path.resolve(process.cwd(), args[fileIdx + 1]), 'utf8').trim();
  } else if (textIdx !== -1 && args[textIdx + 1]) {
    postText = args[textIdx + 1].trim();
  } else {
    console.error('Uso: node post_linkedin.mjs --file post_aprovado.txt [--dry-run] | --whoami');
    process.exit(1);
  }

  let authorUrn = (process.env.LINKEDIN_PERSON_URN || '').trim();
  if (!authorUrn) {
    authorUrn = isDryRun ? 'urn:li:person:EXEMPLO_DRY_RUN' : (await getPersonUrn(token)).urn;
  }

  const articleUrl = linkIdx !== -1 ? args[linkIdx + 1] : null;
  const articleTitle = titleIdx !== -1 ? args[titleIdx + 1] : null;

  const shareContent = {
    shareCommentary: { text: postText },
    shareMediaCategory: articleUrl ? 'ARTICLE' : 'NONE',
  };
  if (articleUrl) {
    const media = { status: 'READY', originalUrl: articleUrl };
    if (articleTitle) media.title = { text: articleTitle };
    shareContent.media = [media];
  }

  const payload = {
    author: authorUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: { 'com.linkedin.ugc.ShareContent': shareContent },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  };

  if (isDryRun) {
    console.log('=== MODO DRY-RUN (Nenhuma requisição enviada ao LinkedIn) ===');
    console.log(`Caracteres: ${postText.length} / 3000`);
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const { status, headers, data } = await apiRequest(
    'https://api.linkedin.com/v2/ugcPosts',
    token,
    'POST',
    payload
  );
  const postId = headers.get('x-restli-id') || data.id || 'desconhecido';
  console.log(`[SUCESSO] Post publicado no LinkedIn (HTTP ${status})!`);
  console.log(`ID/URN: ${postId}`);
  if (String(postId).startsWith('urn:li:')) {
    console.log(`Link direto: https://www.linkedin.com/feed/update/${postId}/`);
  }
}

main();
