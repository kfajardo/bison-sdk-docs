import './app.css'
import { defineBisonComponents } from 'bison-jib-sdk/components'
import { h } from './ui'
import { initLedger, clearLedger } from './ledger'
import * as P from './pages'

defineBisonComponents()

type Page = { id: string; label: string; group: string; render: () => HTMLElement }

const PAGES: Page[] = [
  { id: 'overview', label: 'Overview', group: 'Start', render: P.overview },
  { id: 'onboarding', label: 'Onboarding', group: 'Live', render: P.playgroundOnboarding },
  { id: 'partial', label: 'Partial onboarding', group: 'Live', render: P.playgroundStep },
  { id: 'bank', label: 'Bank CRUD', group: 'Live', render: P.playgroundBank },
  { id: 'functions', label: 'Functions', group: 'Reference', render: P.fnsPage },
  { id: 'validation', label: 'Validation', group: 'Reference', render: P.validationPage },
  { id: 'styling', label: 'Styling', group: 'Reference', render: P.stylingPage },
  { id: 'backend', label: 'Backend contract', group: 'Reference', render: P.backendPage },
]

const app = document.getElementById('app')!
const main = h('main', { class: 'main' }, [h('div', { class: 'main-inner', id: 'view' })])
const ledgerBody = h('div', { class: 'ledger__body' })
const ledger = h('div', { class: 'ledger' }, [
  h('div', { class: 'ledger__head' }, [
    h('span', { class: 'ledger__live' }),
    'event ledger — live bison-* events from the components',
    h('button', { class: 'ledger__clear', onClick: () => clearLedger() }, ['clear']),
  ]),
  ledgerBody,
])

app.append(rail(), main, ledger)
document.body.append(themeToggle(), railToggle())
initLedger(ledgerBody)

function rail(): HTMLElement {
  const groups = [...new Set(PAGES.map((p) => p.group))]
  const nav = h('nav', { class: 'nav' }, groups.map((g) =>
    h('div', { class: 'nav__group' }, [
      h('div', { class: 'nav__label' }, [g]),
      ...PAGES.filter((p) => p.group === g).map((p) =>
        h('button', { class: 'nav__link', 'data-page': p.id, onClick: () => go(p.id) }, [
          h('span', { class: 'nav__dot' }), p.label,
        ])),
    ])))
  return h('aside', { class: 'rail' }, [
    h('div', { class: 'brand' }, [
      h('div', { class: 'brand__mark' }, ['B']),
      h('span', { class: 'brand__name' }, ['bison-jib-sdk']),
      h('span', { class: 'brand__ver' }, ['docs']),
    ]),
    nav,
  ])
}

function go(id: string): void {
  const page = PAGES.find((p) => p.id === id) ?? PAGES[0]
  const view = document.getElementById('view')!
  view.replaceChildren(page.render())
  view.parentElement!.scrollTop = 0
  document.querySelectorAll('.nav__link').forEach((l) =>
    l.classList.toggle('is-active', (l as HTMLElement).dataset.page === id))
  history.replaceState(null, '', `#${id}`)
  app.classList.remove('rail-open')
}

function themeToggle(): HTMLElement {
  const btn = h('button', { class: 'theme-toggle', onClick: toggle }, ['◐ theme']) as HTMLButtonElement
  function toggle() {
    const root = document.documentElement
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    root.setAttribute('data-theme', next)
  }
  // Default to dark (the terminal identity); respect an existing choice.
  if (!document.documentElement.getAttribute('data-theme')) document.documentElement.setAttribute('data-theme', 'dark')
  return btn
}

function railToggle(): HTMLElement {
  return h('button', { class: 'btn rail-toggle', onClick: () => app.classList.toggle('rail-open') }, ['☰ menu'])
}

go(location.hash.slice(1) || 'overview')
