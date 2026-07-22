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

export function code(text: string): HTMLElement {
  return h('code', {}, [text])
}

export function pre(source: string): HTMLElement {
  return h('pre', {}, [h('code', {}, [source])])
}

export function section(title: string): HTMLElement {
  return h('h2', { class: 'sec' }, [title])
}
