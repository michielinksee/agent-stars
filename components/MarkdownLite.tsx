import type { ReactNode } from "react";

/**
 * Minimal Markdown renderer for the error cards (no external dependency).
 * Supports: # / ## / ### headings, paragraphs, "- " bullet lists, "1. " ordered
 * lists, fenced code blocks, GFM tables, inline code, links, bold.
 * Relative links to sibling cards (<key>.md) are rewritten to site routes.
 */

function inline(text: string, key: string, linkBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`)|(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*]+)\*\*)|(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${n++}`;
    if (m[1]) {
      out.push(<code key={k} className="rounded bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 text-[0.9em]">{m[1].slice(1, -1)}</code>);
    } else if (m[2]) {
      let href = m[4];
      if (/^[a-zA-Z0-9_-]+\.md$/.test(href)) href = `${linkBase}/${href.slice(0, -3)}`;
      out.push(<a key={k} href={href} className="underline decoration-zinc-400 hover:decoration-zinc-900 dark:hover:decoration-zinc-100">{inline(m[3], k, linkBase)}</a>);
    } else if (m[5]) {
      out.push(<strong key={k}>{m[6]}</strong>);
    } else if (m[7]) {
      out.push(<a key={k} href={m[7]} className="underline decoration-zinc-400 break-all hover:decoration-zinc-900 dark:hover:decoration-zinc-100">{m[7]}</a>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function MarkdownLite({ source, linkBase, skipH1 = false }: { source: string; linkBase: string; skipH1?: boolean }) {
  const lines = source.split(/\r?\n/);
  const nodes: ReactNode[] = [];
  let i = 0;
  let k = 0;
  const next = () => `b${k++}`;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") { i++; continue; }
    if (line.startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) { buf.push(lines[i]); i++; }
      i++;
      nodes.push(<pre key={next()} className="overflow-x-auto rounded-xl bg-zinc-100 dark:bg-zinc-800 p-4 text-sm my-4"><code>{buf.join("\n")}</code></pre>);
      continue;
    }
    const h = /^(#{1,3}) (.+)$/.exec(line);
    if (h) {
      const level = h[1].length;
      i++;
      if (level === 1 && skipH1) continue;
      const kk = next();
      if (level === 1) nodes.push(<h1 key={kk} className="text-2xl sm:text-3xl font-bold mt-2 mb-4 break-words">{inline(h[2], kk, linkBase)}</h1>);
      else if (level === 2) nodes.push(<h2 key={kk} className="text-xl font-semibold mt-8 mb-3 border-b border-zinc-200 dark:border-zinc-800 pb-1">{inline(h[2], kk, linkBase)}</h2>);
      else nodes.push(<h3 key={kk} className="text-lg font-semibold mt-6 mb-2">{inline(h[2], kk, linkBase)}</h3>);
      continue;
    }
    if (line.startsWith("|")) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) { rows.push(lines[i]); i++; }
      const cells = (r: string) => r.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
      const header = cells(rows[0]);
      const body = rows.slice(1).filter((r) => !/^\|\s*-{2,}/.test(r)).map(cells);
      const kk = next();
      nodes.push(
        <div key={kk} className="overflow-x-auto my-4">
          <table className="text-sm w-full border-collapse">
            <thead><tr>{header.map((c, j) => <th key={j} className="text-left border-b border-zinc-300 dark:border-zinc-700 px-2 py-1">{inline(c, `${kk}h${j}`, linkBase)}</th>)}</tr></thead>
            <tbody>{body.map((r, ri) => <tr key={ri}>{r.map((c, j) => <td key={j} className="align-top border-b border-zinc-200 dark:border-zinc-800 px-2 py-1">{inline(c, `${kk}r${ri}c${j}`, linkBase)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (/^(- |\d+\. )/.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const items: string[] = [];
      while (i < lines.length && /^(- |\d+\. )/.test(lines[i])) {
        let item = lines[i].replace(/^(- |\d+\. )/, "");
        i++;
        while (i < lines.length && /^ {2,}\S/.test(lines[i]) && !/^ {2,}(- |\d+\. )/.test(lines[i])) { item += " " + lines[i].trim(); i++; }
        items.push(item);
      }
      const kk = next();
      const cls = `${ordered ? "list-decimal" : "list-disc"} pl-6 my-3 space-y-1`;
      const children = items.map((it, j) => <li key={j}>{inline(it, `${kk}i${j}`, linkBase)}</li>);
      nodes.push(ordered ? <ol key={kk} className={cls}>{children}</ol> : <ul key={kk} className={cls}>{children}</ul>);
      continue;
    }
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,3} |```|\||- |\d+\. )/.test(lines[i])) { buf.push(lines[i]); i++; }
    const kk = next();
    nodes.push(<p key={kk} className="my-3 leading-relaxed">{inline(buf.join(" "), kk, linkBase)}</p>);
  }
  return <div className="text-zinc-800 dark:text-zinc-200">{nodes}</div>;
}
