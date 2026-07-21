import {
  access,
  cp,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, posix } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const latexmlc = process.env.LATEXMLC ?? 'latexmlc';

const reports = [
  {
    slug: 'andromeda-milky-way',
    title: 'A Distributed-Memory Simulation of the Andromeda-Milky Way Collision',
    imageAlts: {
      'runtime.png': 'Runtime results for theta equal to 0.7',
      'runtime_theta_1.png': 'Runtime results for theta equal to 1.0',
    },
  },
  {
    slug: 'parallel-smith-waterman',
    title: 'Parallel Smith-Waterman with OpenMP',
    imageAlts: {
      'diag.png': 'Parallel processing across matrix diagonals',
      'cachelines.png': 'Potential cache-line layout across matrix tiles',
      'res.png': 'Smith-Waterman runtime results by core count',
    },
  },
  {
    slug: 'bellyflop-os',
    title: 'Bellyflop OS Report',
    preprocess: preprocessBellyflop,
  },
  {
    slug: 'incremental-data-parallel-graph-clustering',
    title: 'Incremental, Data-Parallel Graph Clustering',
  },
];

for (const report of reports) {
  await buildReport(report);
}

async function buildReport(report) {
  const sourceDir = join(repoRoot, 'reports', report.slug);
  const publicDir = join(repoRoot, 'public', 'reports', report.slug);
  const outputPath = join(repoRoot, 'src', 'reports', `${report.slug}.html`);
  const buildRoot = await mkdtemp(join(tmpdir(), `isub-${report.slug}-`));
  const buildSourceDir = join(buildRoot, 'source');
  const buildOutputDir = join(buildRoot, 'output');
  const generatedDocument = join(buildOutputDir, 'report.html');

  try {
    await cp(sourceDir, buildSourceDir, { recursive: true });
    await mkdir(buildOutputDir, { recursive: true });
    await report.preprocess?.(buildSourceDir);

    const conversion = spawnSync(
      latexmlc,
      ['--dest', generatedDocument, '--format', 'html5', 'report.tex'],
      {
        cwd: buildSourceDir,
        encoding: 'utf8',
        maxBuffer: 50 * 1024 * 1024,
      },
    );

    if (conversion.error) {
      throw new Error(
        `Could not run ${latexmlc}. Install LaTeXML or set LATEXMLC to its executable.`,
        { cause: conversion.error },
      );
    }
    if (conversion.status !== 0) {
      process.stderr.write(conversion.stdout ?? '');
      process.stderr.write(conversion.stderr ?? '');
      throw new Error(
        `LaTeXML exited with status ${conversion.status} while building ${report.slug}.`,
      );
    }

    const document = await readFile(generatedDocument, 'utf8');
    const articleMatch = document.match(/<article\b[\s\S]*?<\/article>/);
    if (!articleMatch) {
      throw new Error(
        `LaTeXML output for ${report.slug} did not contain an article element.`,
      );
    }

    await rm(publicDir, { recursive: true, force: true });
    await mkdir(publicDir, { recursive: true });

    let article = articleMatch[0];
    article = restoreNumericCitations(article);
    article = prepareDocumentMarkup(article);
    article = await copyAndRewriteImages({
      article,
      buildOutputDir,
      buildSourceDir,
      publicDir,
      report,
    });

    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(
      outputPath,
      `<!-- Generated from reports/${report.slug}/report.tex. Do not edit directly. -->\n${article}\n`,
    );

    const warningCount = `${conversion.stdout ?? ''}${conversion.stderr ?? ''}`
      .match(/Warning:/g)?.length ?? 0;
    const warningSummary = warningCount ? ` (${warningCount} converter warnings)` : '';
    console.log(`Wrote ${outputPath}${warningSummary}`);
  } finally {
    await rm(buildRoot, { recursive: true, force: true });
  }
}

function restoreNumericCitations(article) {
  const bibliographyIds = [
    ...article.matchAll(/<li id="(bib\.[^"]+)" class="ltx_bibitem/g),
  ].map((match) => match[1]);

  if (bibliographyIds.length === 0) {
    return article;
  }

  const referenceNumber = new Map(
    bibliographyIds.map((id, index) => [id, index + 1]),
  );

  return article.replace(
    /<cite class="([^"]*)">([\s\S]*?)<\/cite>/g,
    (citation, className, contents) => {
      const ids = [...contents.matchAll(/href="#(bib\.[^"]+)"/g)].map(
        (match) => match[1],
      );
      const uniqueIds = [...new Set(ids)];

      if (uniqueIds.length === 0 || uniqueIds.some((id) => !referenceNumber.has(id))) {
        return citation;
      }

      const links = uniqueIds.map(
        (id) => `<a href="#${id}" class="ltx_ref">${referenceNumber.get(id)}</a>`,
      );
      return `<cite class="${className}">[${links.join(', ')}]</cite>`;
    },
  );
}

function prepareDocumentMarkup(article) {
  return article
    .replace(
      '<article class="',
      '<article aria-labelledby="technical-report-title" class="',
    )
    .replace(
      /<h1([^>]*class="[^"]*ltx_title_document[^"]*"[^>]*)>/,
      '<h1 id="technical-report-title"$1>',
    )
    .replace(/<span class="ltx_dates">[\s\S]*?<\/span>/g, '')
    .replace(/<div class="ltx_note ltx_note_frontmatter">[\s\S]*?<\/div>/g, '')
    .replace(
      /<span id="(footnote\d+)" class="ltx_note ltx_role_footnote"><sup class="ltx_note_mark">(\d+)<\/sup>/g,
      '<span id="$1" class="ltx_note ltx_role_footnote"><button type="button" class="ltx_note_mark" aria-label="Show footnote $2">$2</button>',
    );
}

async function copyAndRewriteImages({
  article,
  buildOutputDir,
  buildSourceDir,
  publicDir,
  report,
}) {
  const imagePattern = /<img\b[^>]*\bsrc="([^"]+)"[^>]*>/g;
  const matches = [...article.matchAll(imagePattern)];

  for (const match of matches) {
    const [imageTag, sourceUrl] = match;
    if (/^(?:data:|https?:|\/)/.test(sourceUrl)) {
      continue;
    }

    const sourcePath = sourceUrl.split(/[?#]/, 1)[0].replaceAll('\\', '/');
    const relativePath = safeAssetPath(sourcePath);
    const candidates = [
      join(buildOutputDir, sourcePath),
      join(buildSourceDir, sourcePath),
    ];
    let inputPath;

    for (const candidate of candidates) {
      try {
        await access(candidate);
        inputPath = candidate;
        break;
      } catch {
        // Try the source tree after the converter output directory.
      }
    }

    if (!inputPath) {
      throw new Error(`Could not locate report image ${sourceUrl} for ${report.slug}.`);
    }

    const destinationPath = join(publicDir, relativePath);
    await mkdir(dirname(destinationPath), { recursive: true });
    await copyFile(inputPath, destinationPath);

    const sourceBasename = posix.basename(relativePath);
    const alt = report.imageAlts?.[sourceBasename] ?? `Figure from ${report.title}`;
    let rewrittenTag = imageTag.replace(
      `src="${sourceUrl}"`,
      `src="/reports/${report.slug}/${relativePath}"`,
    );
    rewrittenTag = rewrittenTag.replace(/\s+alt="Refer to caption"/, ` alt="${alt}"`);
    if (!/\salt=/.test(rewrittenTag)) {
      rewrittenTag = rewrittenTag.replace(/>$/, ` alt="${alt}">`);
    }
    if (!/\sloading=/.test(rewrittenTag)) {
      rewrittenTag = rewrittenTag.replace(/>$/, ' loading="lazy" decoding="async">');
    }

    article = article.replace(imageTag, rewrittenTag);
  }

  const objectPattern = /<object\b[^>]*\bdata="([^"]+)"[^>]*><\/object>/g;
  const objects = [...article.matchAll(objectPattern)];

  for (const match of objects) {
    const [objectTag, sourceUrl] = match;
    if (/^(?:data:|https?:|\/)/.test(sourceUrl)) {
      continue;
    }

    const sourcePath = sourceUrl.split(/[?#]/, 1)[0].replaceAll('\\', '/');
    const relativePath = safeAssetPath(sourcePath);
    const candidates = [
      join(buildOutputDir, sourcePath),
      join(buildSourceDir, sourcePath),
    ];
    let inputPath;

    for (const candidate of candidates) {
      try {
        await access(candidate);
        inputPath = candidate;
        break;
      } catch {
        // Try the source tree after the converter output directory.
      }
    }

    if (!inputPath) {
      throw new Error(`Could not locate report graphic ${sourceUrl} for ${report.slug}.`);
    }

    const destinationPath = join(publicDir, relativePath);
    await mkdir(dirname(destinationPath), { recursive: true });
    await copyFile(inputPath, destinationPath);

    const sourceBasename = posix.basename(relativePath);
    const label = report.imageAlts?.[sourceBasename] ?? `Diagram from ${report.title}`;
    let rewrittenTag = objectTag.replace(
      `data="${sourceUrl}"`,
      `data="/reports/${report.slug}/${relativePath}"`,
    );
    if (!/\saria-label=/.test(rewrittenTag)) {
      rewrittenTag = rewrittenTag.replace(
        /<object/,
        `<object role="img" aria-label="${label}"`,
      );
    }

    article = article.replace(objectTag, rewrittenTag);
  }

  return article;
}

function safeAssetPath(sourcePath) {
  const normalized = posix.normalize(sourcePath.replace(/^\.\//, ''));
  if (normalized === '..' || normalized.startsWith('../') || posix.isAbsolute(normalized)) {
    return posix.basename(normalized);
  }
  return normalized;
}

async function preprocessBellyflop(sourceDir) {
  const texFiles = await findFiles(sourceDir, '.tex');

  for (const path of texFiles) {
    let source = await readFile(path, 'utf8');
    source = replaceMintInline(source);
    source = source
      .replace(/\\begin\{minted\}(?:\[[^\]]*\])?\{[^}]+\}/g, '\\begin{verbatim}')
      .replace(/\\end\{minted\}/g, '\\end{verbatim}')
      .replace(/\\includesvg/g, '\\includegraphics')
      .replace(/\\begin\{hindsight\}/g, '\\begin{quote}\\textbf{Hindsight.} ')
      .replace(/\\end\{hindsight\}/g, '\\end{quote}');

    if (path.endsWith('/report.tex')) {
      source = source
        .replace(/\\usepackage\{(?:svg|minted|tcolorbox)\}\s*/g, '')
        .replace(/\\newtcolorbox\{hindsight\}\{[^\n]*\}\s*/g, '')
        .replace(/\\setminted(?:inline)?\s*\{[\s\S]*?\}\s*/g, '');
    }

    await writeFile(path, source);
  }
}

function replaceMintInline(source) {
  const marker = '\\mintinline';
  let cursor = 0;
  let result = '';

  while (cursor < source.length) {
    const markerStart = source.indexOf(marker, cursor);
    if (markerStart === -1) {
      result += source.slice(cursor);
      break;
    }

    result += source.slice(cursor, markerStart);
    let groupStart = skipWhitespace(source, markerStart + marker.length);

    if (source[groupStart] === '[') {
      const optionEnd = source.indexOf(']', groupStart + 1);
      if (optionEnd === -1) {
        result += marker;
        cursor = markerStart + marker.length;
        continue;
      }
      groupStart = skipWhitespace(source, optionEnd + 1);
    }

    const language = readBalancedGroup(source, groupStart);
    const codeStart = language ? skipWhitespace(source, language.end) : -1;
    const code = language && readBalancedGroup(source, codeStart);

    if (!language || !code) {
      result += marker;
      cursor = markerStart + marker.length;
      continue;
    }

    result += `\\texttt{${escapeTexText(code.value)}}`;
    cursor = code.end;
  }

  return result;
}

function readBalancedGroup(source, start) {
  if (source[start] !== '{') {
    return undefined;
  }

  let depth = 0;
  for (let index = start; index < source.length; index += 1) {
    if (source[index] === '{' && source[index - 1] !== '\\') {
      depth += 1;
    } else if (source[index] === '}' && source[index - 1] !== '\\') {
      depth -= 1;
      if (depth === 0) {
        return { value: source.slice(start + 1, index), end: index + 1 };
      }
    }
  }

  return undefined;
}

function skipWhitespace(source, start) {
  let cursor = start;
  while (/\s/.test(source[cursor] ?? '')) {
    cursor += 1;
  }
  return cursor;
}

function escapeTexText(value) {
  const replacements = {
    '\\': '\\textbackslash{}',
    '{': '\\{',
    '}': '\\}',
    '%': '\\%',
    '&': '\\&',
    '#': '\\#',
    '_': '\\_',
    '$': '\\$',
    '^': '\\textasciicircum{}',
    '~': '\\textasciitilde{}',
    '<': '\\textless{}',
    '>': '\\textgreater{}',
  };
  return [...value].map((character) => replacements[character] ?? character).join('');
}

async function findFiles(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        return findFiles(path, extension);
      }
      return entry.name.endsWith(extension) ? [path] : [];
    }),
  );
  return nested.flat();
}
