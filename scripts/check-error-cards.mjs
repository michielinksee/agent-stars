#!/usr/bin/env node
// check-error-cards.mjs — validates wiki/errors/<error_key>.md against SCHEMA-ErrorCard-v1.
//
// Checks: required fields; closed vocabularies; error_key shape and filename match;
// sources non-empty and source_count consistent; field length limits; body section order;
// search_terms_seen present verbatim in the route records (steps[].input of a WebSearch step)
// when the records directories are available; forbidden words (rates / probability / ranking).
//
// Usage: node scripts/check-error-cards.mjs [--records <dir>[,<dir>...]]
// Env:   ROUTE_RECORDS_DIRS — comma-separated directories of *.jsonl route records.
// Exit:  1 on any error. Missing records directories are a warning, not an error.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ERRORS_DIR = path.join(ROOT, "wiki", "errors");

const VOCAB = {
  layer: ["rest", "mcp", "oauth", "cli", "client"],
  environments: ["Claude Desktop", "Claude Code", "Cursor", "Codex", "Windsurf", "other"],
  transport: ["stdio", "streamable-http", "sse", "rest", "na"],
  organ_stopped: ["発見", "理解", "接続", "完遂"],
  symptom_class: ["permission_missing", "wrong_target", "wrong_method", "not_found", "format", "token_expired", "rate_limit", "other"],
  status: ["lived", "verified", "corroborated", "unverified", "extracted_from_issue"],
};

const REQUIRED = [
  "error_key", "error_text", "service_id", "component", "environments", "transport", "organ_stopped",
  "symptom_class", "applies_when", "first_check", "what_was_true", "how_resolved", "success_check",
  "if_not_resolved", "human_step_required", "status", "sources", "source_count", "last_verified",
  "search_terms_seen", "trail", "retests",
];

const LIMITS = { applies_when: 120, first_check: 80, what_was_true: 200, success_check: 80, if_not_resolved: 80 };

// Words the schema forbids (§4): probability, success rate, ranking.
const FORBIDDEN = [/確率/, /成功率/, /順位/, /success rate/i, /probabilit/i];

// Body sections in the order §3 prescribes (H2 headings).
const SECTIONS = ["症状", "該当条件", "最初の確認", "解決手順", "成功の確認", "根拠", "解決しなかった場合", "調査の軌跡", "追試", "この記録の状態"];

// ---------- minimal YAML-subset frontmatter parser ----------
function scalar(raw) {
  const s = raw.trim();
  if (s === "") return "";
  if (s.startsWith('"')) {
    try { return JSON.parse(s); } catch { throw new Error(`bad quoted scalar: ${s}`); }
  }
  if (s === "[]") return [];
  if (s.startsWith("[") && s.endsWith("]")) {
    return s.slice(1, -1).split(",").map((x) => x.trim()).filter(Boolean);
  }
  return s;
}

function parseFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== "---") throw new Error("no frontmatter");
  const end = lines.indexOf("---", 1);
  if (end < 0) throw new Error("unterminated frontmatter");
  const fm = {};
  let i = 1;
  while (i < end) {
    const line = lines[i];
    const m = /^([A-Za-z_][A-Za-z0-9_]*):(.*)$/.exec(line);
    if (!m) throw new Error(`cannot parse line ${i + 1}: ${line}`);
    const key = m[1];
    const rest = m[2];
    if (rest.trim() === "|") {
      const buf = [];
      i++;
      while (i < end && (lines[i].startsWith("  ") || lines[i] === "")) { buf.push(lines[i].replace(/^  /, "")); i++; }
      fm[key] = buf.join("\n").trimEnd();
      continue;
    }
    if (rest.trim() === "" && i + 1 < end && lines[i + 1].startsWith("  - ")) {
      const arr = [];
      i++;
      while (i < end && lines[i].startsWith("  - ")) { arr.push(scalar(lines[i].slice(4))); i++; }
      fm[key] = arr;
      continue;
    }
    fm[key] = scalar(rest);
    i++;
  }
  return { fm, body: lines.slice(end + 1).join("\n") };
}

// ---------- route records ----------
function loadSearchInputs(dirs) {
  const inputs = new Set();
  let files = 0;
  for (const d of dirs) {
    if (!fs.existsSync(d)) { console.warn(`WARN records dir not found: ${d}`); continue; }
    for (const f of fs.readdirSync(d)) {
      if (!f.endsWith(".jsonl")) continue;
      files++;
      for (const line of fs.readFileSync(path.join(d, f), "utf8").split(/\r?\n/)) {
        if (!line.trim()) continue;
        let o; try { o = JSON.parse(line); } catch { continue; }
        for (const s of o.steps || []) if (s && s.tool === "WebSearch" && typeof s.input === "string") inputs.add(s.input);
      }
    }
  }
  return { inputs, files };
}

const argv = process.argv.slice(2);
let recordDirs = [];
const ri = argv.indexOf("--records");
if (ri >= 0 && argv[ri + 1]) recordDirs = argv[ri + 1].split(",");
else if (process.env.ROUTE_RECORDS_DIRS) recordDirs = process.env.ROUTE_RECORDS_DIRS.split(",");
else {
  const research = path.resolve(ROOT, "..", "KanseiLINK", "founder-ops", "research");
  recordDirs = [
    path.join(research, "AgentRoute-Footprint_2026-10-20", "runs"),
    path.join(research, "ReuseTest_2026-10", "runs"),
  ];
}
const { inputs: searchInputs, files: recordFiles } = loadSearchInputs(recordDirs);
const recordsAvailable = recordFiles > 0;
if (!recordsAvailable) console.warn("WARN no route records found; search_terms_seen will not be verified");

// ---------- checks ----------
const problems = [];
const summary = [];
const files = fs.existsSync(ERRORS_DIR) ? fs.readdirSync(ERRORS_DIR).filter((f) => f.endsWith(".md")).sort() : [];
if (files.length === 0) problems.push(`no cards in ${ERRORS_DIR}`);

for (const file of files) {
  const p = path.join(ERRORS_DIR, file);
  const text = fs.readFileSync(p, "utf8");
  const err = (msg) => problems.push(`${file}: ${msg}`);
  let fm, body;
  try { ({ fm, body } = parseFrontmatter(text)); } catch (e) { err(e.message); continue; }

  for (const k of REQUIRED) if (!(k in fm)) err(`missing field ${k}`);

  const key = fm.error_key || "";
  const km = /^(rest|mcp|oauth|cli|client)-(\d{3}|na)-([A-Za-z0-9_]+)-([a-z0-9][a-z0-9-]*)$/.exec(key);
  if (!km) err(`error_key does not match <layer>-<status>-<provider_code>-<slug>: ${key}`);
  if (file !== `${key}.md`) err(`filename ${file} != error_key ${key}.md`);

  if (!fm.error_text) err("error_text empty");
  if (!fm.service_id) err("service_id empty");
  if (!fm.component) err("component empty");

  const envs = Array.isArray(fm.environments) ? fm.environments : [];
  if (envs.length === 0) err("environments empty");
  for (const e of envs) if (!VOCAB.environments.includes(e)) err(`environments: not in vocabulary: ${e}`);
  for (const k of ["transport", "organ_stopped", "symptom_class", "status"]) {
    if (fm[k] !== undefined && !VOCAB[k].includes(fm[k])) err(`${k}: not in vocabulary: ${fm[k]}`);
  }
  if (!(fm.human_step_required === "no" || /^yes: .{1,80}$/.test(fm.human_step_required || ""))) err(`human_step_required must be 'no' or 'yes: <80 chars>': ${fm.human_step_required}`);
  if (!fm.how_resolved) err("how_resolved empty");

  for (const [k, lim] of Object.entries(LIMITS)) {
    const v = fm[k] || "";
    if ([...v].length > lim) err(`${k} is ${[...v].length} chars (limit ${lim})`);
  }

  const sources = Array.isArray(fm.sources) ? fm.sources : [];
  if (sources.length === 0) err("sources empty");
  for (const s of sources) if (!/^(https?:\/\/\S+|AWT-\d{3}|AS-\d{6}|arm\d-\S+|A\d+ \S+)$/.test(s)) err(`sources: not a URL / card_id / run id: ${s}`);
  if (Number(fm.source_count) !== sources.length) err(`source_count ${fm.source_count} != sources.length ${sources.length}`);

  if (fm.status === "verified" && !fm.last_verified) err("status verified requires last_verified");
  if (fm.last_verified && !/^\d{4}-\d{2}-\d{2}$/.test(fm.last_verified)) err(`last_verified is not a date: ${fm.last_verified}`);

  const terms = Array.isArray(fm.search_terms_seen) ? fm.search_terms_seen : null;
  if (terms === null) err("search_terms_seen must be a list (use [] when none)");
  else if (recordsAvailable) for (const t of terms) if (!searchInputs.has(t)) err(`search_terms_seen not found verbatim in route records: ${t}`);

  if (!Array.isArray(fm.trail) || fm.trail.length === 0) err("trail empty");
  if (!Array.isArray(fm.retests)) err("retests must be a list (use [] when none)");

  // Body: H1 must equal error_text; H2 sections in order.
  const h1 = /^# (.+)$/m.exec(body);
  if (!h1) err("no H1"); else if (h1[1].trim() !== String(fm.error_text).trim()) err("H1 is not error_text verbatim");
  const h2s = [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
  let pos = 0;
  for (const sec of SECTIONS) {
    const idx = h2s.indexOf(sec, pos);
    if (idx < 0) { err(`missing or out-of-order section: ## ${sec}`); break; }
    pos = idx + 1;
  }

  for (const re of FORBIDDEN) if (re.test(text)) err(`forbidden word (rate / probability / ranking): ${re}`);

  summary.push({ error_key: key, status: fm.status, source_count: sources.length, search_terms: terms ? terms.length : 0 });
}

console.log(`cards: ${files.length}  records: ${recordFiles} files, ${searchInputs.size} distinct WebSearch inputs`);
console.table(summary);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}
console.log("OK: all cards pass");
