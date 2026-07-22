import './app.css'
import { defineBisonComponents } from 'bison-jib-sdk/components'
import { h } from './ui'
import * as P from './pages'

defineBisonComponents()

type Page = { id: string; label: string; group: string; render: () => HTMLElement }

const PAGES: Page[] = [
  { id: 'overview', label: 'Quickstart', group: 'Start here', render: P.overview },
  { id: 'onboarding', label: 'Onboarding', group: 'Web components', render: P.onboardingPage },
  { id: 'onboarding-partial', label: 'Partial onboarding', group: 'Web components', render: P.onboardingPartialPage },
  { id: 'bank-accounts', label: 'Bank accounts', group: 'Web components', render: P.bankAccountsPage },
  { id: 'functions', label: 'Functions', group: 'SDK reference', render: P.fnsPage },
  { id: 'validation', label: 'Validation', group: 'SDK reference', render: P.validationPage },
]

const app = document.getElementById('app')!
const main = h('main', { class: 'main' }, [h('div', { class: 'main-inner', id: 'view' })])

app.append(rail(), main)
document.body.append(railToggle())

function rail(): HTMLElement {
  const groups = [...new Set(PAGES.map((p) => p.group))]
  const nav = h('nav', { class: 'nav' }, groups.map((g) =>
    h('div', { class: 'nav__group' }, [
      h('div', { class: 'nav__label' }, [g]),
      ...PAGES.filter((p) => p.group === g).map((p) =>
        h('button', { class: 'nav__link', 'data-page': p.id, onClick: () => go(p.id) }, [p.label])),
    ])))
  return h('aside', { class: 'rail' }, [
    h('div', { class: 'brand' }, [
      h('span', { class: 'brand__name' }, ['Bison Jib SDK']),
      h('span', { class: 'brand__ver' }, ['Documentation']),
    ]),
    nav,
  ])
}

function go(id: string): void {
  const page = PAGES.find((p) => p.id === id) ?? PAGES[0]
  const view = document.getElementById('view')!
  document.dispatchEvent(new Event('docs-page-dispose'))
  view.replaceChildren(page.render())
  view.parentElement!.scrollTop = 0
  document.querySelectorAll('.nav__link').forEach((l) =>
    l.classList.toggle('is-active', (l as HTMLElement).dataset.page === id))
  history.replaceState(null, '', `#${id}`)
  app.classList.remove('rail-open')
}

function railToggle(): HTMLElement {
  return h('button', { class: 'btn rail-toggle', onClick: () => app.classList.toggle('rail-open') }, ['☰ menu'])
}

go(location.hash.slice(1) || 'overview')
window.addEventListener('hashchange', () => go(location.hash.slice(1) || 'overview'))
