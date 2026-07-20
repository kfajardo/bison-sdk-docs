// The event ledger: the docs are wired to the SDK's mock, so bison-* events from the
// live components stream here. This is the site's signature — the contract executing.
import { h } from './ui'

let body: HTMLElement
let count = 0

const kind = (name: string): string =>
  name.includes('error') ? 'error' : name.startsWith('bison-bank') ? 'bank' : 'onboard'

export function initLedger(root: HTMLElement): void {
  body = root
  render()
  // Any bison-* event bubbling to document lands in the ledger.
  const names = [
    'bison-step-change', 'bison-status-checked', 'bison-before-submit',
    'bison-submit-success', 'bison-submit-error',
    'bison-bank-added', 'bison-bank-verified', 'bison-bank-default-changed',
    'bison-bank-deleted', 'bison-bank-error',
  ]
  for (const n of names) {
    document.addEventListener(n, (e) => log(n, (e as CustomEvent).detail))
  }
}

function render(): void {
  body.replaceChildren()
  if (count === 0) {
    body.append(h('div', { class: 'ledger__empty' }, ['— no events yet. Drive a component above to see the contract fire. —']))
  }
}

function short(detail: unknown): string {
  if (detail == null) return ''
  try {
    const s = typeof detail === 'string' ? detail : JSON.stringify(detail)
    return s.length > 120 ? s.slice(0, 117) + '…' : s
  } catch {
    return String(detail)
  }
}

export function clearLedger(): void {
  count = 0
  render()
}

function log(name: string, detail: unknown): void {
  if (count === 0) body.replaceChildren()
  count++
  const now = new Date()
  const t = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
  const row = h('div', { class: 'ledger__row' }, [
    h('span', { class: 'ledger__t' }, [t]),
    h('span', { class: `ledger__name ledger__name--${kind(name)}` }, [name]),
    h('span', { class: 'ledger__detail' }, [short(detail)]),
  ])
  body.prepend(row)
}
