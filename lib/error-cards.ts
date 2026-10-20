/**
 * Error cards: wiki/errors/<error_key>.md read from the repository at build time.
 *
 * The Markdown in the repository is the canonical record (正本). This module
 * only parses it: a minimal frontmatter parser (same YAML subset as
 * scripts/check-error-cards.mjs) and a split of the body into blocks.
 * No remark/gray-matter dependency.
 */
import fs from "node:fs";
import path from "node:path";

export const ERRORS_DIR = path.join(process.cwd(), "wiki", "errors");
export const GITHUB_ERRORS_BASE =
  "https://github.com/michielinksee/agent-stars/blob/main/wiki/errors";

export interface ErrorCard {
  error_key: string;
  error_text: string;
  service_id: string;
  component: string;
  environments: string[];
  transport: string;
  organ_stopped: string;
  symptom_class: string;
  applies_when: string;
  first_check: string;
  what_was_true: string;
  how_resolved: string;
  success_check: string;
  if_not_resolved: string;
  human_step_required: string;
  status: string;
  sources: string[];
  source_count: number;
  last_verified: string;
  search_terms_seen: string[];
  trail: string[];
  retests: string[];
  /** Markdown body after the frontmatter (H1 included). */
  body: string;
}

function scalar(raw: string): string | string[] {
  const s = raw.trim();
  if (s === "") return "";
  if (s.startsWith('"')) return JSON.parse(s) as string;
  if (s === "[]") return [];
  if (s.startsWith("[") && s.endsWith("]")) {
    return s
      .slice(1, -1)
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return s;
}

export function parseCard(text: string): ErrorCard {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== "---") throw new Error("no frontmatter");
  const end = lines.indexOf("---", 1);
  if (end < 0) throw new Error("unterminated frontmatter");
  const fm: Record<string, string | string[]> = {};
  let i = 1;
  while (i < end) {
    const m = /^([A-Za-z_][A-Za-z0-9_]*):(.*)$/.exec(lines[i]);
    if (!m) throw new Error(`cannot parse frontmatter line ${i + 1}`);
    const key = m[1];
    const rest = m[2];
    if (rest.trim() === "|") {
      const buf: string[] = [];
      i++;
      while (i < end && (lines[i].startsWith("  ") || lines[i] === "")) {
        buf.push(lines[i].replace(/^  /, ""));
        i++;
      }
      fm[key] = buf.join("\n").trimEnd();
      continue;
    }
    if (rest.trim() === "" && i + 1 < end && lines[i + 1].startsWith("  - ")) {
      const arr: string[] = [];
      i++;
      while (i < end && lines[i].startsWith("  - ")) {
        arr.push(String(scalar(lines[i].slice(4))));
        i++;
      }
      fm[key] = arr;
      continue;
    }
    fm[key] = scalar(rest);
    i++;
  }
  const str = (k: string) => (typeof fm[k] === "string" ? (fm[k] as string) : "");
  const list = (k: string) => (Array.isArray(fm[k]) ? (fm[k] as string[]) : []);
  return {
    error_key: str("error_key"),
    error_text: str("error_text"),
    service_id: str("service_id"),
    component: str("component"),
    environments: list("environments"),
    transport: str("transport"),
    organ_stopped: str("organ_stopped"),
    symptom_class: str("symptom_class"),
    applies_when: str("applies_when"),
    first_check: str("first_check"),
    what_was_true: str("what_was_true"),
    how_resolved: str("how_resolved"),
    success_check: str("success_check"),
    if_not_resolved: str("if_not_resolved"),
    human_step_required: str("human_step_required"),
    status: str("status"),
    sources: list("sources"),
    source_count: Number(str("source_count")) || list("sources").length,
    last_verified: str("last_verified"),
    search_terms_seen: list("search_terms_seen"),
    trail: list("trail"),
    retests: list("retests"),
    body: lines.slice(end + 1).join("\n").trim(),
  };
}

export function listErrorCards(): ErrorCard[] {
  if (!fs.existsSync(ERRORS_DIR)) return [];
  return fs
    .readdirSync(ERRORS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => parseCard(fs.readFileSync(path.join(ERRORS_DIR, f), "utf8")));
}

export function getErrorCard(key: string): ErrorCard | null {
  if (!/^[a-zA-Z0-9_-]+$/.test(key)) return null;
  const p = path.join(ERRORS_DIR, `${key}.md`);
  if (!fs.existsSync(p)) return null;
  const card = parseCard(fs.readFileSync(p, "utf8"));
  return card.error_key === key ? card : null;
}

/** Group cards by service_id, preserving file order within a service. */
export function groupByService(cards: ErrorCard[]): Map<string, ErrorCard[]> {
  const m = new Map<string, ErrorCard[]>();
  for (const c of cards) {
    const arr = m.get(c.service_id) ?? [];
    arr.push(c);
    m.set(c.service_id, arr);
  }
  return m;
}
