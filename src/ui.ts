// Tiny render helpers. Text goes in via textContent (no innerHTML for data) to stay
// injection-safe; only trusted static markup uses innerHTML.

type Attrs = Record<string, string | number | boolean | ((e: Event) => void)>

export function h(tag: string, attrs: Attrs = {}, children: (Node | string)[] = []): HTMLElement {
  const node = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (typeof v === 'function') node.addEventListener(k.replace(/^on/, '').toLowerCase(), v as EventListener)
    else if (k === 'html') node.innerHTML = String(v)
    else if (v === true) node.setAttribute(k, '')
    else if (v !== false) node.setAttribute(k, String(v))
  }
  for (const c of children) node.append(c instanceof Node ? c : document.createTextNode(c))
  return node
}

export const el = h

/** A titled, header-sticky table from rows of cells (strings rendered as text, Nodes as-is). */
export function table(headers: string[], rows: (Node | string)[][]): HTMLElement {
  const thead = h('thead', {}, [h('tr', {}, headers.map((x) => h('th', {}, [x])))])
  const tbody = h('tbody', {}, rows.map((r) => h('tr', {}, r.map((c) => h('td', {}, [c])))))
  return h('div', { class: 'tbl-wrap' }, [h('table', {}, [thead, tbody])])
}

export function method(m: string): HTMLElement {
  return h('span', { class: `method method--${m.toLowerCase()}` }, [m])
}

export function code(text: string): HTMLElement {
  return h('code', {}, [text])
}

/** Syntax-lite highlighted code block (keywords/strings/comments/functions). */
export function pre(source: string): HTMLElement {
  const escaped = source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const html = escaped
    .replace(/(\/\/[^\n]*)/g, '<span class="tok-com">$1</span>')
    .replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, '<span class="tok-str">$1</span>')
    .replace(/\b(import|from|const|let|await|async|function|return|new|export|type|interface)\b/g, '<span class="tok-key">$1</span>')
    .replace(/(\b[a-zA-Z_]\w*)(\()/g, '<span class="tok-fn">$1</span>$2')
  return h('pre', {}, [h('code', { html })])
}

export function section(title: string): HTMLElement {
  return h('h2', { class: 'sec' }, [title])
}
