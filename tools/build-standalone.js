#!/usr/bin/env node
/* ==========================================================================
 * Gera dist/AnaliseSIMTCE.html: um único arquivo HTML com todo o CSS, todo
 * o JS da aplicação e as bibliotecas vendorizadas (JSZip, SheetJS, sql.js)
 * embutidos. Sem dependências externas (Node puro). Esse arquivo pode ser
 * copiado para qualquer computador e aberto direto no navegador (duplo
 * clique) — funciona offline, com impressão e exportação completas, porque
 * não passa pelo visualizador restrito do artefato publicado.
 *
 * Uso: node tools/build-standalone.js
 * ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');

const html = read('index.html');
const css = read('css/style.css');

// Ordem dos <script src="...">, na mesma sequência do index.html
const scripts = [
  'vendor/jszip.min.js',
  'vendor/xlsx.full.min.js',
  'vendor/sql-wasm-b64.js',
  'vendor/sql-wasm.js',
  'js/layouts.js',
  'js/parser.js',
  'js/db.js',
  'js/builder.js',
  'js/reports.js',
  'js/docx.js',
  'js/app.js',
];

// Fecha </script> dentro do JS (não deveria ocorrer, mas protege contra quebrar o HTML)
const safeJs = src => src.replace(/<\/script>/gi, '<\\/script>');

// IMPORTANTE: usar função de substituição, nunca string. O SheetJS minificado
// contém sequências "$&"/"$'" no próprio código-fonte (formatação de número);
// se o conteúdo fosse passado como string para .replace(), o motor JS
// interpretaria esses "$" como padrões especiais de regex e corromperia a
// saída. Uma função de substituição devolve o texto literal, sem interpretar nada.
let out = html.replace(
  '<link rel="stylesheet" href="css/style.css">',
  () => `<style>\n${css}\n</style>`
);

for (const rel of scripts) {
  const tag = `<script src="${rel}"></script>`;
  if (!out.includes(tag)) throw new Error(`Tag não encontrada no index.html: ${tag}`);
  const src = read(rel);
  out = out.replace(tag, () => `<script>\n${safeJs(src)}\n</script>`);
}

if (/<script src=/.test(out)) throw new Error('Sobrou <script src> não embutida — confira a lista `scripts` acima.');
if (/<link rel="stylesheet"/.test(out)) throw new Error('Sobrou <link rel="stylesheet"> não embutido.');

const destDir = path.join(ROOT, 'dist');
fs.mkdirSync(destDir, { recursive: true });
const destFile = path.join(destDir, 'AnaliseSIMTCE.html');
fs.writeFileSync(destFile, out, 'utf8');
console.log(`Gerado ${path.relative(ROOT, destFile)} (${(out.length / 1024 / 1024).toFixed(2)} MB)`);
