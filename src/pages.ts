import { h, table, code, pre, section } from './ui'
import * as D from './data'
import { createClient, createMockState, mock } from '@kfajardo/sdk'
import type { Scope } from '@kfajardo/sdk'
import { gsap } from 'gsap'
import sdkStyles from '../../bison-sdk/src/styles.css?inline'
import { closestConnector, cropVisualizerTarget, fitVisualizerTarget } from './visualizer'

// The only mounted SDK previews live inside each component's styling journey.
const client = createClient({ transport: mock() })
const scope: Scope = { persona: 'wio', id: 'wio_docs_1' }

function head(title: string, lede: string): HTMLElement {
  return h('div', { class: 'docs-page' }, [
    h('header', { class: 'page-head' }, [
      h('h1', { class: 'page-title' }, [title]),
      h('p', { class: 'lede' }, [lede]),
    ]),
  ])
}

function apiReference(api: D.ComponentApi): HTMLElement {
  const groups: [string, D.ApiGroup][] = [
    ['Attributes', api.attributes],
    ['Properties', api.properties],
    ['Events', api.events],
    ['Exported types', api.types],
  ]
  return h('div', { class: 'api-reference' }, groups.map(([title, group]) => h('article', { class: 'api-group' }, [
    h('h3', {}, [title]),
    h('p', { class: 'api-group__intro' }, [group.intro]),
    h('dl', {}, group.members.map(([name, description]) => h('div', {}, [
      h('dt', {}, [code(name)]),
      h('dd', {}, [description]),
    ]))),
  ])))
}

function stateReference(attributes: readonly D.StateAttribute[]): HTMLElement {
  return h('div', { class: 'state-reference' }, attributes.map((attribute) => h('article', {}, [
    h('header', {}, [h('h3', {}, [code(attribute.name)]), h('p', {}, [attribute.target])]),
    h('dl', {}, attribute.values.map(([value, meaning]) => h('div', {}, [
      h('dt', {}, [code(value)]),
      h('dd', {}, [meaning]),
    ]))),
  ])))
}

function tokenReference(tokens: readonly (readonly string[])[]): HTMLElement {
  return h('div', { class: 'token-reference' }, tokens.map(([name, defaultValue, purpose]) => {
    const color = /^#[0-9a-f]{6}$/i.test(defaultValue)
    return h('article', {}, [
      h('h3', {}, [code(name)]),
      h('div', { class: 'token-default' }, [
        color ? h('span', { class: 'token-swatch', style: `background:${defaultValue}`, 'aria-hidden': 'true' }) : '',
        code(defaultValue),
      ]),
      h('p', {}, [purpose]),
    ])
  }))
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

export function overview(): HTMLElement {
  const page = h('div', { class: 'docs-page' })
  page.append(h('section', { class: 'docs-hero' }, [
    h('h1', { class: 'docs-hero__title' }, ['Bison Jib SDK']),
    h('p', { class: 'docs-hero__lede' }, ['Add onboarding and banking to your product with web components or the SDK client.']),
    h('div', { class: 'docs-hero__actions' }, [
      h('a', { class: 'btn btn--primary', href: '#onboarding' }, ['View onboarding', h('span', { 'aria-hidden': 'true' }, ['→'])]),
      h('a', { class: 'btn', href: '#functions' }, ['View functions']),
    ]),
  ]))

  page.append(section('Quickstart'))
  page.append(h('p', { class: 'section-lede' }, ['Install the package, register the components, and add onboarding.']))
  page.append(h('div', { class: 'quickstart' }, [
    h('div', { class: 'quickstart__notes' }, [
      h('div', {}, [h('strong', {}, ['One package']), h('p', {}, ['Components, client, and validation.'])]),
      h('div', {}, [h('strong', {}, ['Ready to embed']), h('p', {}, ['Register and mount a component.'])]),
      h('div', {}, [h('strong', {}, ['Flexible UI']), h('p', {}, ['Use a component or build your own.'])]),
    ]),
    h('div', { class: 'quickstart__code' }, [
      h('div', { class: 'quickstart__code-bar' }, ['Terminal']),
      pre(`npm install @kfajardo/sdk`),
      h('div', { class: 'quickstart__code-bar' }, ['HTML']),
      pre(`<bison-onboarding
  persona="wio"
  scope-id="wio_123"
></bison-onboarding>`),
      h('div', { class: 'quickstart__code-bar' }, ['JavaScript']),
      pre(`import { createClient } from '@kfajardo/sdk'
import { defineBisonComponents } from '@kfajardo/sdk/components'
import '@kfajardo/sdk/styles.css'

defineBisonComponents()
const onboarding = document.querySelector('bison-onboarding')
onboarding.client = createClient({
  baseUrl: 'https://api.yourhost.com',
  auth: { getToken: fetchClientToken },
})`),
    ]),
  ]))

  page.append(section('How it works'))
  page.append(h('p', { class: 'section-lede' }, ['Bison components and custom interfaces use the same client.']))
  const systemParts = [
    ['Your product', 'Your customer experience.', 'Use a Bison component or your own interface.'],
    ['Bison components', 'Ready-made onboarding and banking.', 'Includes accessible states and validation.'],
    ['Your interface', 'Custom UI with Bison validation.', 'Use the shared rules with the SDK client.'],
    ['SDK client', 'Onboarding and banking calls.', 'Components and custom interfaces share one client.'],
    ['Your API', 'Your onboarding and banking data.', 'The SDK client connects components to your backend.'],
  ]
  const systemNodes = systemParts.map(([title, summary, detail], index) => h('button', {
    class: 'system-node',
    type: 'button',
    'aria-expanded': 'false',
    'aria-controls': `system-detail-${index}`,
  }, [
    h('h3', {}, [title]),
    h('p', { class: 'system-node__summary' }, [summary]),
    h('div', { class: 'system-node__detail', id: `system-detail-${index}`, 'aria-hidden': 'true' }, [h('p', {}, [detail])]),
  ]))
  page.append(h('div', { class: 'system-map' }, [
    systemNodes[0],
    h('span', { class: 'system-map__connector', 'aria-hidden': 'true' }, ['→']),
    h('div', { class: 'system-map__paths' }, [systemNodes[1], systemNodes[2]]),
    h('span', { class: 'system-map__connector', 'aria-hidden': 'true' }, ['→']),
    systemNodes[3],
    h('span', { class: 'system-map__connector', 'aria-hidden': 'true' }, ['→']),
    systemNodes[4],
  ]))

  page.append(section('Connect your backend'))
  page.append(h('p', { class: 'section-lede' }, ['Point the client to your API and provide a short-lived token.']))
  page.append(pre(`const bison = createClient({
  baseUrl: 'https://api.yourhost.com',
  auth: { getToken: fetchClientToken },
})`))
  page.append(h('div', { class: 'callout' }, [
    h('span', { html: '<strong>Keep secrets on the server.</strong> Your Bison API key creates the short-lived client token; it never ships to the browser.' }),
  ]))

  page.append(section('Set the scope'))
  page.append(h('p', { class: 'section-lede' }, ['Every component and API call needs a scope.']))
  page.append(h('div', { class: 'scope-grid' }, [
    h('article', {}, [h('h3', {}, ['WIO']), h('p', {}, ['One WIO account.']), pre(`{ persona: 'wio', id: 'wio_123' }`)]),
    h('article', {}, [h('h3', {}, ['WIO entity']), h('p', {}, ['One entity in a WIO account.']), pre(`{
  persona: 'wio',
  id: 'wio_123',
  entityId: 'entity_456',
}`)]),
    h('article', {}, [h('h3', {}, ['Operator']), h('p', {}, ['One operator account.']), pre(`{ persona: 'operator', id: 'operator_123' }`)]),
  ]))

  animateOverview(page, systemNodes)
  return page
}

function animateOverview(page: HTMLElement, nodes: HTMLElement[]): void {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  const abort = new AbortController()
  let intro: gsap.core.Timeline | undefined

  function expand(node: HTMLElement, open: boolean): void {
    const detail = node.querySelector<HTMLElement>('.system-node__detail')!
    node.setAttribute('aria-expanded', String(open))
    detail.setAttribute('aria-hidden', String(!open))
    gsap.killTweensOf([node, detail])
    gsap.to(detail, { height: open ? 'auto' : 0, autoAlpha: open ? 1 : 0, y: open ? 0 : -6, duration: reducedMotion ? 0 : .32, ease: 'power2.out' })
    gsap.to(node, { backgroundColor: open ? 'var(--primary-light)' : 'var(--card)', borderColor: open ? 'var(--primary)' : 'var(--border)', duration: reducedMotion ? 0 : .24 })
  }

  nodes.forEach((node) => {
    node.addEventListener('pointerenter', () => expand(node, true), { signal: abort.signal })
    node.addEventListener('pointerleave', () => { if (!node.matches(':focus')) expand(node, false) }, { signal: abort.signal })
    node.addEventListener('focus', () => expand(node, true), { signal: abort.signal })
    node.addEventListener('blur', () => expand(node, false), { signal: abort.signal })
    node.addEventListener('click', () => expand(node, true), { signal: abort.signal })
  })

  requestAnimationFrame(() => {
    if (!page.isConnected || reducedMotion) return
    intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from(page.querySelector('.docs-hero__title'), { y: 28, autoAlpha: 0, duration: .75 })
      .from(page.querySelector('.docs-hero__lede'), { y: 18, autoAlpha: 0, duration: .55 }, '-=.42')
      .from(page.querySelectorAll('.docs-hero__actions > *'), { y: 12, autoAlpha: 0, duration: .4, stagger: .08 }, '-=.28')
      .from(page.querySelectorAll('.quickstart > *, .system-map > *'), { y: 18, autoAlpha: 0, duration: .5, stagger: .06 }, '-=.05')
  })

  document.addEventListener('docs-page-dispose', () => {
    abort.abort()
    intro?.kill()
    gsap.killTweensOf([page, ...page.querySelectorAll('*')])
  }, { once: true })
}

export function onboardingPage(): HTMLElement {
  return componentDocumentation(
    'onboarding',
    'Onboarding',
    'A complete KYB flow with business-first gating, resume behavior, documents, and banking composition.',
  )
}

export function onboardingPartialPage(): HTMLElement {
  return componentDocumentation(
    'partial',
    'Partial onboarding',
    'An unstyled partial onboarding flow with built-in manual bank-account submission.',
  )
}

export function bankAccountsPage(): HTMLElement {
  return componentDocumentation(
    'bank',
    'Bank accounts',
    'Bank-account registration, micro-deposit verification, default selection, and guarded deletion.',
  )
}

export function fnsPage(): HTMLElement {
  const page = head('Functions', 'Use these standalone functions in your own onboarding interface.') as HTMLElement
  const dialog = returnTypeDialog()
  page.append(section('Create a client'))
  page.append(pre(`import { createClient } from '@kfajardo/sdk'

const {
  getUser,
  getOnboardingStatus,
  getOnboardingSection,
  submitOnboardingSection,
  uploadOnboardingDocument,
} = createClient({
  baseUrl: 'https://api.yourhost.com',
  auth: { getToken: fetchClientToken },
})`))
  page.append(section('Available functions'))
  page.append(table(['Function', 'Returns', 'Notes'], D.onboardingFns.map((f) => [
    code(f.sig),
    h('button', { class: 'type-link', type: 'button', onClick: () => dialog.open(f.type, f.ret) }, [code(f.ret)]),
    f.desc,
  ])))
  page.append(dialog.element)
  return page
}

function returnTypeDialog(): { element: HTMLDialogElement; open: (type: keyof typeof D.returnTypes, label: string) => void } {
  const title = h('code')
  const source = h('code')
  const dialog = h('dialog', { class: 'type-dialog', 'aria-labelledby': 'return-type-title' }, [
    h('header', { class: 'type-dialog__header' }, [
      h('div', {}, [h('span', {}, ['Return type']), h('h2', { id: 'return-type-title' }, [title])]),
      h('button', { class: 'type-dialog__close', type: 'button', 'aria-label': 'Close return type', onClick: () => dialog.close() }, ['Close']),
    ]),
    h('pre', {}, [source]),
  ]) as HTMLDialogElement
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close()
  })
  return {
    element: dialog,
    open(type, label) {
      title.textContent = label
      source.textContent = D.returnTypes[type]
      dialog.showModal()
    },
  }
}

export function validationPage(): HTMLElement {
  const page = head('Validation rules', 'The platform’s exact Zod schemas. Use them in custom forms before calling core; the web components use the same rules.') as HTMLElement
  page.append(section('Partial onboarding rules'))
  page.append(table(['Field', 'Rule', 'Message'], D.partialOnboardingVal.map((v) => [code(v.name), code(v.rule), v.msg])))
  page.append(section('Legacy multi-step onboarding rules'))
  page.append(table(['Field', 'Rule', 'Message'], D.onboardingVal.map((v) => [code(v.name), code(v.rule), v.msg])))
  page.append(section('Banking rules'))
  page.append(table(['Field', 'Rule', 'Message'], D.bankingVal.map((v) => [code(v.name), code(v.rule), v.msg])))
  return page
}

type StylingStep = {
  title: string
  description: string
  file: string
  code: string
}

type EmbeddableId = 'onboarding' | 'partial' | 'bank'

type EmbeddableGuide = {
  id: EmbeddableId
  label: string
  tag: string
  markup: string
  polishTitle: string
  polishDescription: string
  polishCode: string
  polishCss: string
  visualViews: VisualView[]
  visualTargets: VisualTarget[]
}

type VisualState = 'manual'

type VisualView = {
  id: string
  selector: string
  focus: [number, number, number, number]
  box: [number, number, number, number]
  fit?: boolean
  state?: VisualState
}

type VisualTarget = {
  label: string
  description: string
  selector: string
  view: string
  anchorSelector?: string
  labelAt: [number, number]
}

const embeddables: EmbeddableGuide[] = [
  {
    id: 'onboarding',
    label: 'Full onboarding',
    tag: 'bison-onboarding',
    markup: `<bison-onboarding
  persona="wio"
  scope-id="wio_1"
></bison-onboarding>`,
    polishTitle: 'Shape the onboarding sections',
    polishDescription: 'Target the onboarding section contract and its data-state values. Only this embeddable changes.',
    polishCode: `.bison-onboarding__section {
  border-top: 1px solid var(--bison-border);
}

.bison-onboarding__section-header {
  width: 100%;
  padding: 1rem 0;
  border: 0;
  background: transparent;
  text-align: left;
}

.bison-onboarding__section[data-state="active"]
  .bison-onboarding__section-title {
  color: var(--bison-accent);
}`,
    polishCss: `.styling-preview .bison-onboarding__section { border-top: 1px solid var(--bison-border); }
.styling-preview .bison-onboarding__section-header { width: 100%; display: flex; justify-content: space-between; padding: 1rem 0; border: 0; background: transparent; color: var(--bison-text); text-align: left; }
.styling-preview .bison-onboarding__section-title { font: 600 .95rem var(--bison-font); }
.styling-preview .bison-onboarding__section[data-state="active"] .bison-onboarding__section-title { color: var(--bison-accent); }
.styling-preview .bison-onboarding__section-body { padding-bottom: 1.5rem; }`,
    visualViews: [
      { id: 'overview', selector: '.bison-onboarding__section[data-state="active"]', focus: [0, 0, .06, .18], box: [20, 2, 60, 28] },
      { id: 'form', selector: '.bison-onboarding__form', focus: [0, 0, .06, .1], box: [5, 36, 62, 38] },
      { id: 'action', selector: '.bison-onboarding__button--next', focus: [.5, .5, .5, .5], box: [42, 80, 38, 18] },
    ],
    visualTargets: [
      { label: '.bison-onboarding', description: 'component root', selector: '.bison-onboarding', view: 'overview', labelAt: [0, 8] },
      { label: '[data-state="active"]', description: 'active section state', selector: '.bison-onboarding__section[data-state="active"]', view: 'overview', anchorSelector: '.bison-onboarding__section-title', labelAt: [80, 9] },
      { label: '.bison-onboarding__form', description: 'responsive form grid', selector: '.bison-onboarding__form', view: 'form', labelAt: [69, 43] },
      { label: '.bison-onboarding__section-header', description: 'section control', selector: '.bison-onboarding__section-header', view: 'overview', anchorSelector: '.bison-onboarding__section-title', labelAt: [0, 23] },
      { label: '.bison-field__input', description: 'shared field control', selector: '.bison-field__input', view: 'form', labelAt: [69, 65] },
      { label: '--bison-accent', description: 'component color token', selector: '.bison-onboarding__button--next', view: 'action', labelAt: [20, 89] },
    ],
  },
  {
    id: 'partial',
    label: 'Partial onboarding',
    tag: 'bison-onboarding-partial',
    markup: `<bison-onboarding-partial
  persona="wio"
  scope-id="wio_1"
></bison-onboarding-partial>`,
    polishTitle: 'Shape the verification flow',
    polishDescription: 'Give the stacked verification sections and built-in bank submission one clear hierarchy.',
    polishCode: `.bison-partial {
  display: grid;
  gap: var(--bison-gap);
  max-width: 40rem;
  margin-inline: auto;
}

.bison-partial__form {
  display: grid;
  gap: var(--bison-gap);
}

.bison-partial__section {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--bison-gap);
  min-inline-size: 0;
  margin: 0;
  padding: var(--bison-pad);
  border: 1px solid var(--bison-border);
  border-radius: var(--bison-radius);
  background: var(--bison-surface-raised);
}

.bison-partial__section-title {
  grid-column: 1 / -1;
  padding-inline: .35rem;
  font-weight: 700;
}

.bison-partial__nav {
  display: flex;
  justify-content: flex-end;
}

.bison-partial__button {
  min-height: var(--bison-field-h);
  padding: .55rem 1rem;
  color: var(--bison-accent-contrast);
  border: 1px solid var(--bison-accent);
  border-radius: var(--bison-radius-sm);
  background: var(--bison-accent);
}`,
    polishCss: `.styling-preview .bison-partial { display: grid; gap: var(--bison-gap); max-width: 40rem; margin-inline: auto; }
.styling-preview .bison-partial__form { display: grid; gap: var(--bison-gap); }
.styling-preview .bison-partial__section { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--bison-gap); min-inline-size: 0; margin: 0; padding: var(--bison-pad); border: 1px solid var(--bison-border); border-radius: var(--bison-radius); background: var(--bison-surface-raised); }
.styling-preview .bison-partial__section-title { grid-column: 1 / -1; padding-inline: .35rem; color: var(--bison-text); font-weight: 700; }
.styling-preview .bison-partial__nav { display: flex; justify-content: flex-end; }
.styling-preview .bison-partial__button { min-height: var(--bison-field-h); padding: .55rem 1rem; color: var(--bison-accent-contrast); border: 1px solid var(--bison-accent); border-radius: var(--bison-radius-sm); background: var(--bison-accent); font: inherit; font-weight: 600; }`,
    visualViews: [
      { id: 'form', selector: '.bison-partial', focus: [0, 0, 0, 0], box: [18, 2, 64, 96], fit: true },
    ],
    visualTargets: [
      { label: '.bison-partial', description: 'continuous form root', selector: '.bison-partial', view: 'form', labelAt: [0, 9] },
      { label: '.bison-partial__section--contact', description: 'corporation contact fields', selector: '.bison-partial__section--contact', view: 'form', anchorSelector: '.bison-partial__section-title', labelAt: [82, 12] },
      { label: '.bison-field__input', description: 'shared validated field control', selector: '.bison-field__input', view: 'form', labelAt: [0, 23] },
      { label: '.bison-partial__section--ownership', description: 'beneficial-owner controls', selector: '.bison-partial__section--ownership', view: 'form', anchorSelector: '.bison-partial__button--add-owner', labelAt: [82, 58] },
      { label: '.bison-partial__terms-link', description: 'Bison terms disclosure', selector: '.bison-partial__terms-link', view: 'form', labelAt: [82, 72] },
      { label: '.bison-partial__nav', description: 'single form action', selector: '.bison-partial__nav', view: 'form', labelAt: [0, 80] },
      { label: '.bison-partial__button--submit', description: 'enabled only when every field is valid', selector: '.bison-partial__button--submit', view: 'form', labelAt: [82, 80] },
      { label: '.bison-partial__section--banking', description: 'manual destination account', selector: '.bison-partial__section--banking', view: 'form', anchorSelector: '.bison-partial__section-title', labelAt: [82, 91] },
    ],
  },
  {
    id: 'bank',
    label: 'Bank accounts',
    tag: 'bison-bank-accounts',
    markup: `<bison-bank-accounts
  persona="wio"
  scope-id="wio_1"
></bison-bank-accounts>`,
    polishTitle: 'Shape the banking surface',
    polishDescription: 'Style the empty state and provider controls without touching either onboarding flow.',
    polishCode: `.bison-bank-accounts__empty {
  margin: 0;
  padding: 4rem 1rem;
  text-align: center;
  color: var(--bison-text-muted);
}

.bison-bank-accounts__method-chooser {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--bison-gap-sm);
}`,
    polishCss: `.styling-preview .bison-bank-accounts__empty { margin: 0; padding: 4rem 1rem; text-align: center; color: var(--bison-text-muted); border: 1px dashed var(--bison-border); border-radius: var(--bison-radius); }
.styling-preview .bison-bank-accounts__method-chooser { display: grid; grid-template-columns: 1fr 1fr; gap: var(--bison-gap-sm); }
.styling-preview .bison-bank-accounts__button--manual { color: var(--bison-text); background: transparent; border-color: var(--bison-border-strong); }`,
    visualViews: [
      { id: 'surface', selector: '.bison-bank-accounts', focus: [0, 0, .04, .05], box: [20, 5, 60, 90], state: 'manual' },
    ],
    visualTargets: [
      { label: '.bison-bank-accounts', description: 'component root', selector: '.bison-bank-accounts', view: 'surface', labelAt: [0, 11] },
      { label: '.bison-bank-accounts__empty', description: 'empty account state', selector: '.bison-bank-accounts__empty', view: 'surface', labelAt: [0, 35] },
      { label: '[data-provider]', description: 'selected provider state', selector: '[data-provider="manual"]', view: 'surface', anchorSelector: '.bison-bank-accounts__button--manual', labelAt: [0, 68] },
      { label: '.bison-bank-accounts__method-chooser', description: 'provider controls', selector: '.bison-bank-accounts__method-chooser', view: 'surface', labelAt: [80, 45] },
      { label: '.bison-bank-accounts__button--plaid', description: 'Plaid action', selector: '.bison-bank-accounts__button--plaid', view: 'surface', labelAt: [80, 62] },
      { label: '--bison-radius', description: 'surface shape token', selector: '.bison-bank-accounts__button--manual', view: 'surface', labelAt: [80, 79] },
    ],
  },
]

function stylingSteps(guide: EmbeddableGuide): StylingStep[] {
  return [
    {
      title: `Render ${guide.label.toLowerCase()}`,
      description: 'Start with accessible light-DOM markup and no visual layer. This document and component remain in place for every following step.',
      file: 'index.html',
      code: journeyCode(guide, 0),
    },
    {
      title: 'Add the starter theme',
      description: `Add the optional baseline to the same document. The mounted <${guide.tag}> responds without being replaced.`,
      file: 'index.html',
      code: journeyCode(guide, 1),
    },
    {
      title: 'Apply your brand',
      description: 'Add component-scoped tokens to the same stylesheet. Color, focus, and shape interpolate in place.',
      file: 'index.html',
      code: journeyCode(guide, 2),
    },
    {
      title: guide.polishTitle,
      description: guide.polishDescription,
      file: 'index.html',
      code: journeyCode(guide, 3),
    },
  ]
}

function journeyCode(guide: EmbeddableGuide, step: number): string {
  const css = step >= 2 ? `\n  <style>\n${indent(brandCode(guide) + (step >= 3 ? `\n\n${guide.polishCode}` : ''), 4)}\n  </style>` : ''
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">${css}
</head>
<body>
${indent(guide.markup, 2)}

  <script type="module">
    import { createClient } from '@kfajardo/sdk'
    import { defineBisonComponents } from '@kfajardo/sdk/components'${step >= 1 ? `\n    import '@kfajardo/sdk/styles.css'` : ''}

    defineBisonComponents()
    document.querySelector('${guide.tag}').client = createClient({
      baseUrl: 'https://api.yourhost.com',
      auth: { getToken: fetchClientToken },
    })
  </script>
</body>
</html>`
}

function indent(source: string, spaces: number): string {
  const pad = ' '.repeat(spaces)
  return source.split('\n').map((line) => pad + line).join('\n')
}

function brandCode(guide: EmbeddableGuide): string {
  return `${guide.tag} {
  --bison-accent: #4c7b63;
  --bison-accent-hover: #365d4a;
  --bison-accent-soft: #ecf3f0;
  --bison-focus-ring: #4c7b63;
  --bison-radius: 16px;
  --bison-radius-sm: 10px;
}`
}

function brandStyles(guide: EmbeddableGuide): string {
  return brandCode(guide).replace(guide.tag, `.styling-preview ${guide.tag}`)
}

type DemoElement = HTMLElement & { client?: unknown }

function createDemo(id: EmbeddableId): DemoElement {
  const guide = embeddables.find((item) => item.id === id)!
  const demo = document.createElement(guide.tag) as DemoElement
  demo.setAttribute('persona', scope.persona)
  demo.setAttribute('scope-id', scope.id)
  demo.client = id === 'partial'
    ? createClient({ transport: mock({ seed: createMockState({ businessProfileStatus: 'Completed', hasUsAddress: true }) }) })
    : client
  return demo
}

const componentUsage: Record<EmbeddableId, string> = {
  onboarding: `import { createClient } from '@kfajardo/sdk'
import { defineBisonComponents } from '@kfajardo/sdk/components'

defineBisonComponents()

const onboarding = document.querySelector('bison-onboarding')
onboarding.client = createClient({
  baseUrl: 'https://api.yourhost.com',
  auth: { getToken: fetchClientToken },
})

// Optional: seed known values per section (field names match the forms).
onboarding.prefill = {
  business: { legalBusinessName: 'Bison Energy LLC', email: 'ops@bison.energy' },
  officer: { firstName: 'Jane', lastName: 'Doe' },
}

// Optional: replace section titles and state text announced by screen readers.
onboarding.labels = {
  active: 'In progress',
  locked: 'Complete previous steps',
  done: 'Complete',
  error: 'Needs attention',
  business: 'Company details',
}`,
  partial: `import { createClient } from '@kfajardo/sdk'
import { defineBisonComponents } from '@kfajardo/sdk/components'

defineBisonComponents()

const partial = document.querySelector('bison-onboarding-partial')
partial.client = createClient({
  baseUrl: 'https://api.yourhost.com',
  auth: { getToken: fetchClientToken },
})`,
  bank: `import { createClient } from '@kfajardo/sdk'
import { defineBisonComponents } from '@kfajardo/sdk/components'

defineBisonComponents()

const accounts = document.querySelector('bison-bank-accounts')
accounts.client = createClient({
  baseUrl: 'https://api.yourhost.com',
  auth: { getToken: fetchClientToken },
})`,
}

const componentBehavior: Record<EmbeddableId, string[]> = {
  onboarding: [
    'Business information is always first; every later section remains locked until it completes.',
    'Returning users resume at the first incomplete or action-required section.',
    'Documents and bank accounts appear after the business profile becomes eligible.',
    'Each section submits independently; the component never posts the whole flow at once.',
    'Prefill known values via .prefill (or the JSON prefill attribute), keyed by section; redacted-resume placeholders win for fields the server already holds.',
    'Section headers show titles only—never raw state words. Style each state through data-state; screen readers receive a human-readable state description that you can override through .labels or the JSON labels attribute.',
    'JSON attributes are read when the element connects; invalid JSON is ignored. Set .prefill or .labels to update an already-mounted component.',
  ],
  partial: [
    'Contact, incorporation, leadership, ownership, consent, and bank submission are rendered inside one light-DOM component.',
    'The WIO submits one manual destination account for the operator’s use. Existing accounts are never fetched or displayed.',
    'The submit button remains disabled until every field, ownership certification, and Bison consent passes validation.',
    'A new entity submits business profile with an embedded control officer, then beneficial owners.',
    'An existing provider entity receives a separate control-officer update between business and owners.',
    'Each successful request emits bison-submit-success; a failure emits bison-submit-error and stops the sequence.',
    'bison-partial-complete fires only after every required partial onboarding request succeeds.',
  ],
  bank: [
    'Manual registration validates the routing number with the ABA checksum before submission.',
    'Micro-deposit codes accept MV#### or four digits; the SDK normalizes both forms.',
    'The default account and the last remaining account cannot be deleted.',
    'Banking eligibility depends on the onboarding business profile and address.',
  ],
}

const componentTypeExamples: Partial<Record<EmbeddableId, string>> = {
  onboarding: `import type {
  OnboardingLabels,
  OnboardingPrefill,
  SectionUiState,
} from '@kfajardo/sdk/components'

const prefill: OnboardingPrefill = {
  business: { legalBusinessName: 'Bison Energy LLC' },
  owners: [{ firstName: 'Jane', ownershipPercentage: '50' }],
}

const labels: OnboardingLabels = {
  // State overrides change the section header's accessible name, not visible text.
  active: 'In progress',
  business: 'Company details',
}

const state: SectionUiState = 'active'`,
}

function componentDocumentation(id: EmbeddableId, title: string, lede: string): HTMLElement {
  const guide = embeddables.find((item) => item.id === id)!
  const page = head(title, lede)

  page.append(section('Use the component'))
  page.append(pre(`${guide.markup}\n\n${componentUsage[id]}`))

  page.append(section('How it behaves'))
  page.append(h('ul', { class: 'docs-list' }, componentBehavior[id].map((item) => h('li', {}, [item]))))

  page.append(section('Public API'))
  page.append(h('p', { class: 'section-lede' }, ['Use attributes for markup, properties for live JavaScript values, events to coordinate the surrounding product, and exported types to keep those integrations checked.']))
  page.append(apiReference(D.publicApi[id]))

  const typeExample = componentTypeExamples[id]
  if (typeExample) {
    page.append(section('Typed configuration'))
    page.append(pre(typeExample))
  }

  page.append(section('Styling journey'))
  page.append(h('p', { class: 'section-lede' }, ['The journey below mounts the documented example. One live preview changes as you move through its steps.']))
  page.append(stylingWalkthrough(guide))

  page.append(section('Styling reference'))
  page.append(h('p', { class: 'section-lede' }, ['See each public hook attached to the exact part of the rendered component it controls.']))
  page.append(componentVisualizer(guide))

  const states = D.stateAttrs[id]
  if (states.length) {
    page.append(section('State attributes'))
    page.append(h('p', { class: 'section-lede' }, ['These values are written by the component. Use them as stable styling hooks or to understand what the rendered UI is communicating.']))
    page.append(stateReference(states))
  }

  page.append(section('Design tokens'))
  page.append(h('p', { class: 'section-lede' }, [`Set these on <${guide.tag}> to theme only this component. Color swatches show the light-theme defaults.`]))
  page.append(tokenReference(D.tokens))
  return page
}

function componentVisualizer(guide: EmbeddableGuide): HTMLElement {
  const root = h('section', { class: 'component-visualizer', 'aria-label': `${guide.label} styling map` })
  const canvas = h('div', { class: 'component-visualizer__canvas' })
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.classList.add('component-visualizer__lines')
  svg.setAttribute('aria-hidden', 'true')

  const viewIndexes = new Map(guide.visualViews.map((view, index) => [view.id, index]))
  const samples = guide.visualViews.map((view) => {
    const [left, top, width, height] = view.box
    const sample = h('div', { class: 'component-visualizer__sample', 'aria-hidden': 'true' })
    Object.assign(sample.style, { left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` })
    return sample
  })
  const demos = samples.map((sample) => {
    const shadow = sample.attachShadow({ mode: 'open' })
    const sampleStyles = h('style')
    sampleStyles.textContent = sdkStyles
      .replaceAll(':root[data-theme="dark"]', ':host([data-theme="dark"])')
      .replaceAll(':root[data-theme="light"]', ':host')
      .replaceAll(':root', ':host') + `\n${brandCode(guide)}\n${guide.polishCode}`
    const demo = createDemo(guide.id)
    demo.inert = true
    demo.style.position = 'absolute'
    demo.style.width = '38rem'
    shadow.append(sampleStyles, demo)
    return demo
  })
  const targetViewIndexes = guide.visualTargets.map((target) => viewIndexes.get(target.view)!)
  const paths: SVGPathElement[] = []
  const dots: SVGCircleElement[] = []
  const labels = guide.visualTargets.map((target) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    path.classList.add('component-visualizer__line')
    dot.classList.add('component-visualizer__dot')
    dot.setAttribute('r', '3')
    svg.append(path, dot)
    paths.push(path)
    dots.push(dot)

    const label = h('button', {
      class: 'component-visualizer__label',
      type: 'button',
      'aria-label': `${target.label}: ${target.description}`,
    }, [
      h('code', {}, [target.label]),
      h('span', {}, [target.description]),
    ])
    label.style.left = `${target.labelAt[0]}%`
    label.style.top = `${target.labelAt[1]}%`
    return label
  })

  canvas.append(...samples, svg, ...labels)
  root.append(canvas)

  let frame = 0
  let revealed = false
  let dimmedNodes: Element[] = []
  let introTimeline: gsap.core.Timeline | undefined
  const resizeObserver = new ResizeObserver(schedule)
  const mutationObserver = new MutationObserver(schedule)
  const prepared = new WeakSet<DemoElement>()
  const abort = new AbortController()

  function schedule(): void {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(draw)
  }

  function draw(): void {
    if (!root.isConnected) return

    const canvasRect = canvas.getBoundingClientRect()
    guide.visualViews.forEach((view, index) => {
      const demo = demos[index]
      const sample = samples[index]
      if (!prepared.has(demo)) {
        if (view.state === 'manual') {
          const manual = demo.querySelector<HTMLButtonElement>('.bison-bank-accounts__button--manual')
          if (!manual) return
          manual.click()
        }
        prepared.add(demo)
      }

      const camera = demo.querySelector<HTMLElement>(view.selector)
      if (!camera) {
        sample.hidden = true
        return
      }
      sample.hidden = false
      demo.style.left = '0'
      demo.style.top = '0'
      demo.style.transform = 'none'
      if (view.fit) {
        const fitted = fitVisualizerTarget(sample.getBoundingClientRect(), demo.getBoundingClientRect())
        demo.style.left = `${fitted.left}px`
        demo.style.top = `${fitted.top}px`
        demo.style.transformOrigin = 'top left'
        demo.style.transform = `scale(${fitted.scale})`
        return
      }
      const frame = cropVisualizerTarget(
        sample.getBoundingClientRect(),
        demo.getBoundingClientRect(),
        camera.getBoundingClientRect(),
        view.focus,
      )
      demo.style.left = `${frame.left}px`
      demo.style.top = `${frame.top}px`
    })

    let found = 0
    guide.visualTargets.forEach((target, index) => {
      const viewIndex = targetViewIndexes[index]
      const demo = demos[viewIndex]
      const sample = samples[viewIndex]
      const affected = demo.querySelector<HTMLElement>(target.selector)
      const anchor = target.anchorSelector ? demo.querySelector<HTMLElement>(target.anchorSelector) : affected
      const label = labels[index]
      const path = paths[index]
      const dot = dots[index]
      if (sample.hidden || !affected || !anchor) {
        label.hidden = true
        path.style.display = 'none'
        dot.style.display = 'none'
        return
      }

      found++
      label.hidden = false
      path.style.display = ''
      dot.style.display = ''

      const labelRect = label.getBoundingClientRect()
      const anchorRect = anchor.getBoundingClientRect()
      const connector = closestConnector(labelRect, anchorRect, sample.getBoundingClientRect())
      const startX = connector.startX - canvasRect.left
      const startY = connector.startY - canvasRect.top
      const endX = connector.endX - canvasRect.left
      const endY = connector.endY - canvasRect.top
      const dx = endX - startX
      const dy = endY - startY
      const pathData = Math.abs(dx) >= Math.abs(dy)
        ? `M ${startX} ${startY} C ${startX + dx * .55} ${startY}, ${startX + dx * .55} ${endY}, ${endX} ${endY}`
        : `M ${startX} ${startY} C ${startX} ${startY + dy * .55}, ${endX} ${startY + dy * .55}, ${endX} ${endY}`
      path.setAttribute('d', pathData)
      dot.setAttribute('cx', String(endX))
      dot.setAttribute('cy', String(endY))
    })

    if (!revealed && found) {
      revealed = true
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set([...labels, ...paths, ...dots], { opacity: 1 })
      } else {
        introTimeline = gsap.timeline()
          .fromTo(labels, { autoAlpha: 0 }, { autoAlpha: 1, duration: .5, stagger: .07, ease: 'power2.out' })
          .fromTo(paths, { opacity: 0, strokeDashoffset: 36 }, { opacity: 1, strokeDashoffset: 0, duration: .65, stagger: .06, ease: 'power2.out' }, '<.08')
          .fromTo(dots, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .25, stagger: .06, ease: 'back.out(2)' }, '<.2')
      }
    }
  }

  function emphasize(active: number | null): void {
    introTimeline?.progress(1).kill()
    introTimeline = undefined
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : .22
    if (dimmedNodes.length) {
      gsap.killTweensOf(dimmedNodes)
      if (active === null) {
        const restored = dimmedNodes
        gsap.to(restored, { opacity: 1, duration, onComplete: () => gsap.set(restored, { clearProps: 'opacity' }) })
      } else {
        gsap.set(dimmedNodes, { clearProps: 'opacity' })
      }
      dimmedNodes = []
    }

    const activeView = active === null ? null : targetViewIndexes[active]
    samples.forEach((sample, index) => gsap.to(sample, { opacity: activeView === null || index === activeView ? 1 : .16, duration }))
    labels.forEach((label, index) => gsap.to(label, { opacity: active === null || index === active ? 1 : .24, duration }))
    paths.forEach((path, index) => gsap.to(path, { opacity: active === null || index === active ? 1 : .08, duration }))
    dots.forEach((dot, index) => gsap.to(dot, { opacity: active === null || index === active ? 1 : .12, duration }))

    if (active === null) return
    const demo = demos[activeView!]
    const anchor = demo.querySelector(guide.visualTargets[active].selector)
    if (!anchor) return
    dimmedNodes = [...demo.querySelectorAll('*')].filter((node) => !node.contains(anchor) && !anchor.contains(node))
    gsap.to(dimmedNodes, { opacity: .12, duration })
  }

  function cleanup(): void {
    cancelAnimationFrame(frame)
    resizeObserver.disconnect()
    mutationObserver.disconnect()
    abort.abort()
    introTimeline?.kill()
    gsap.killTweensOf([...samples, ...labels, ...paths, ...dots, ...dimmedNodes])
    document.removeEventListener('docs-page-dispose', cleanup)
  }

  resizeObserver.observe(canvas)
  samples.forEach((sample) => resizeObserver.observe(sample))
  demos.forEach((demo) => mutationObserver.observe(demo, { childList: true, subtree: true }))
  labels.forEach((label, index) => {
    label.addEventListener('pointerenter', () => emphasize(index), { signal: abort.signal })
    label.addEventListener('pointerleave', () => emphasize(null), { signal: abort.signal })
    label.addEventListener('focus', () => emphasize(index), { signal: abort.signal })
    label.addEventListener('blur', () => emphasize(null), { signal: abort.signal })
  })
  window.addEventListener('resize', schedule, { passive: true, signal: abort.signal })
  document.addEventListener('docs-page-dispose', cleanup, { once: true })
  schedule()
  return root
}

function stylingWalkthrough(guide: EmbeddableGuide): HTMLElement {
  let active = 0
  const demo = createDemo(guide.id)
  const injectedStyles = h('style')
  const preview = h('div', { class: 'styling-preview' }, [demo])
  const codeBlock = pre('')
  const codeBody = h('div', { class: 'styling-code__body' }, [codeBlock])
  const codeNode = codeBlock.querySelector('code')!
  const file = h('span', { class: 'styling-code__file' })
  const copy = h('button', { class: 'styling-code__copy', type: 'button' }, ['Copy']) as HTMLButtonElement
  const title = h('h2', { class: 'styling-guide__title' })
  const description = h('p', { class: 'styling-guide__description' })
  const prev = h('button', { class: 'btn styling-guide__nav', type: 'button' }, ['← Previous']) as HTMLButtonElement
  const next = h('button', { class: 'btn btn--primary styling-guide__nav', type: 'button' }, ['Next step →']) as HTMLButtonElement
  let layoutAnimations: Animation[] = []

  const buttons = Array.from({ length: 4 }, (_, index) => h('button', {
    class: 'styling-step',
    type: 'button',
    onClick: () => show(index),
  }, [h('span', { class: 'styling-step__label' })]) as HTMLButtonElement)

  const stepper = h('div', { class: 'styling-stepper' }, buttons)

  function show(index: number): void {
    const steps = stylingSteps(guide)
    active = Math.max(0, Math.min(steps.length - 1, index))
    const step = steps[active]
    title.textContent = step.title
    description.textContent = step.description
    file.textContent = step.file
    codeNode.textContent = step.code

    layoutAnimations.forEach((animation) => animation.cancel())
    const motionTargets = [
      demo,
      ...demo.querySelectorAll<HTMLElement>('.bison-onboarding__section, .bison-onboarding__form, .bison-partial__section, .bison-partial__form, .bison-field, .bison-bank-accounts__empty, .bison-bank-accounts__method-chooser'),
    ]
    const before = new Map(motionTargets.map((element) => [element, element.getBoundingClientRect()]))
    injectedStyles.textContent = active === 0 ? '' : sdkStyles + (active >= 2 ? brandStyles(guide) : '') + (active >= 3 ? guide.polishCss : '')

    layoutAnimations = animateLayout(motionTargets, before)

    buttons.forEach((button, i) => {
      const buttonLabel = button.querySelector('.styling-step__label')!
      buttonLabel.textContent = steps[i].title
      button.setAttribute('aria-label', steps[i].title)
      button.classList.toggle('is-active', i === active)
      button.classList.toggle('is-complete', i < active)
      button.setAttribute('aria-current', i === active ? 'step' : 'false')
    })
    prev.disabled = active === 0
    next.disabled = active === steps.length - 1
    next.textContent = active === steps.length - 1 ? 'Journey complete ✓' : 'Next step →'
  }

  prev.addEventListener('click', () => show(active - 1))
  next.addEventListener('click', () => show(active + 1))
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(stylingSteps(guide)[active].code)
      copy.textContent = 'Copied ✓'
    } catch {
      copy.textContent = 'Copy unavailable'
    }
    setTimeout(() => { copy.textContent = 'Copy' }, 1200)
  })

  const walkthrough = h('section', { class: 'styling-guide', 'aria-label': 'Interactive styling walkthrough' }, [
    injectedStyles,
    stepper,
    h('div', { class: 'styling-guide__intro', 'aria-live': 'polite' }, [title, description]),
    h('div', { class: 'styling-workbench' }, [
      h('div', { class: 'styling-code' }, [
        h('div', { class: 'styling-code__bar' }, [file, copy]),
        codeBody,
      ]),
      h('div', { class: 'styling-canvas' }, [
        h('div', { class: 'styling-canvas__bar' }, ['Live SDK component', h('span', { class: 'styling-canvas__viewport' }, ['responsive preview'])]),
        preview,
      ]),
    ]),
    h('div', { class: 'styling-guide__footer' }, [prev, h('span', { class: 'styling-guide__hint' }, ['Choose a change or move through the journey.']), next]),
  ])
  show(0)
  return walkthrough
}

function animateLayout(elements: HTMLElement[], before: Map<HTMLElement, DOMRect>): Animation[] {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return []
  const animations: Animation[] = []
  for (const element of elements) {
    const first = before.get(element)
    if (!first || !element.isConnected) continue
    const last = element.getBoundingClientRect()
    if (!first.width || !first.height || !last.width || !last.height) continue
    const dx = first.left - last.left
    const dy = first.top - last.top
    const leaf = element.classList.contains('bison-field')
    const sx = leaf ? 1 : first.width / last.width
    const sy = leaf ? 1 : first.height / last.height
    if (Math.abs(dx) < .5 && Math.abs(dy) < .5 && Math.abs(sx - 1) < .01 && Math.abs(sy - 1) < .01) continue
    animations.push(element.animate([
      { transformOrigin: 'top left', transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
      { transformOrigin: 'top left', transform: 'none' },
    ], { duration: 650, easing: 'cubic-bezier(.22, 1, .36, 1)' }))
  }
  return animations
}
