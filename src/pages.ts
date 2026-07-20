import { h, table, method, code, pre, section } from './ui'
import * as D from './data'
import { createClient, mock, resolveResumeStep } from 'bison-jib-sdk'
import type { Scope } from 'bison-jib-sdk'
import { isValidAbaRouting } from 'bison-jib-sdk/validation'

// One shared mock-backed client + scope for every live component on the site, so the
// onboarding you complete unlocks the banking you then add — the real gating, live.
const client = createClient({ transport: mock() })
const scope: Scope = { persona: 'wio', id: 'wio_demo_1' }

function head(eyebrow: string, title: string, lede: string): HTMLElement {
  return h('div', {}, [
    h('div', { class: 'eyebrow' }, [eyebrow]),
    h('h1', { class: 'page-title' }, [title]),
    h('p', { class: 'lede' }, [lede]),
  ])
}

function routeRows(routes: D.Route[]): (Node | string)[][] {
  return routes.map((r) => [
    method(r.method),
    code(r.path),
    r.body ? code(r.body) : h('span', { class: 'muted' }, ['—']),
    h('span', {}, [code(r.returns), r.note ? h('div', { class: 'muted', style: 'margin-top:.25rem;font-size:12px' }, [r.note]) : '']),
  ])
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

export function overview(): HTMLElement {
  const page = h('div', {}, [
    head('bison-jib-sdk', 'Embed Bison onboarding and banking', 'A typed API client, the platform’s exact validation rules, and unstyled web components for KYB onboarding and bank-account CRUD. Framework-agnostic, consumer-styled, and driven here by an in-browser mock so every demo runs with no backend.'),
  ])

  page.append(section('Three layers, use any of them'))
  page.append(table(['Layer', 'Import', 'What it is'], [
    [h('strong', {}, ['Core']), code("bison-jib-sdk"), 'Typed async functions over the KYB + banking contract, plus the mock transport.'],
    [h('strong', {}, ['Validation']), code("bison-jib-sdk/validation"), 'The platform’s exact zod rules — validate your own forms before calling core.'],
    [h('strong', {}, ['Components']), code("bison-jib-sdk/components"), 'Light-DOM web components for the full flow. Zero CSS shipped.'],
  ]))

  page.append(section('Install'))
  page.append(pre(`npm install bison-jib-sdk

import { createClient, mock } from 'bison-jib-sdk'
import { defineBisonComponents } from 'bison-jib-sdk/components'
// optional starter theme:
import 'bison-jib-sdk/styles.css'`))

  page.append(section('The transport seam'))
  page.append(h('p', {}, ['Everything sits on a ', code('Transport'), '. Point it at the real API, or at ', code('mock()'), ' to build and demo with no backend — the surface is identical.']))
  page.append(pre(`// real API — token minted server-side, no API key in the browser
const bison = createClient({
  baseUrl: 'https://api.yourhost.com',
  auth: { getToken: async () => fetchClientToken() },
})

// local dev / these docs — executable spec, no backend
const bison = createClient({ transport: mock() })`))

  page.append(h('div', { class: 'callout' }, [
    h('span', { html: '<strong>Auth:</strong> no <code>X-Embeddable-Key</code>. The SDK sends a bearer token from <code>auth.getToken()</code> — mint it server-side from a Bison API key so no secret reaches the browser.' }),
  ]))

  page.append(section('The scope model'))
  page.append(h('p', {}, ['One ', code('scope'), ' threads through every call and component, and picks the route family. Flip ', code('persona'), ' — the SDK resolves the rest.']))
  page.append(pre(`type Scope = {
  persona: 'wio' | 'operator'
  id: string          // WIO id or Operator id
  entityId?: string   // WIO sub-entity (partial onboarding)
}`))
  return page
}

export function playgroundOnboarding(): HTMLElement {
  const page = head(
    'live · driven by mock()',
    'Onboarding',
    'The real <bison-onboarding> element, wired to the mock. Complete the business section and the later sections unlock — that’s the platform’s business-first gating running live. Watch the event ledger below.',
  ) as HTMLElement

  const el = document.createElement('bison-onboarding')
  el.setAttribute('persona', scope.persona)
  el.setAttribute('scope-id', scope.id)
  ;(el as unknown as { client: unknown }).client = client

  const bar = h('div', { class: 'pg-bar' }, [
    h('span', { class: 'pg-bar__label' }, ['persona']),
    persona(el),
    h('button', { class: 'btn', onClick: () => (el as unknown as { refresh(): void }).refresh() }, ['↻ refresh status']),
    h('button', { class: 'btn', onClick: () => resetMock(el) }, ['⤾ reset mock']),
    h('span', { class: 'pg-bar__label', style: 'margin-left:auto' }, ['unstyled · light DOM']),
  ])

  const stage = h('div', { class: 'stage' }, [el])
  page.append(bar, stage)

  page.append(section('Resume logic'))
  page.append(h('p', {}, [code('resolveResumeStep(status)'), ' decides where a returning user lands: business-first lock, an ', code('action_required'), ' section wins, else the first incomplete section.']))
  page.append(pre(`const status = await bison.onboarding.getStates(scope)
const step = resolveResumeStep(status)   // 'business' | 'officer' | 'owners' | 'volume' | 'documents'
await bison.onboarding.submit(scope, { step: 'business', data })`))
  liveResume(page)
  return page
}

export function playgroundStep(): HTMLElement {
  const page = head(
    'live · driven by mock()',
    'Partial onboarding',
    'A single section standalone via <bison-onboarding-step>. Use it when one party completes one section another party’s flow depends on. It exposes .value and .validate() for custom flows.',
  ) as HTMLElement

  const select = h('select', { class: 'btn', onChange: (e) => swap((e.target as HTMLSelectElement).value) },
    ['business', 'officer', 'owners', 'volume'].map((s) => h('option', { value: s }, [s]))) as HTMLSelectElement

  const stage = h('div', { class: 'stage' }, [])
  const swap = (step: string) => {
    const el = document.createElement('bison-onboarding-step')
    el.setAttribute('step', step)
    el.setAttribute('persona', scope.persona)
    el.setAttribute('scope-id', scope.id)
    ;(el as unknown as { client: unknown }).client = client
    stage.replaceChildren(el)
  }
  swap('officer')

  page.append(h('div', { class: 'pg-bar' }, [h('span', { class: 'pg-bar__label' }, ['step']), select]), stage)
  return page
}

export function playgroundBank(): HTMLElement {
  const page = head(
    'live · driven by mock()',
    'Bank CRUD',
    'The <bison-bank-crud> element. Add a manual account (routing 021000021, any 4–20 digit number), verify with code MV1234, set default, delete. The default and last-account delete guards are enforced client-side — the backend has none.',
  ) as HTMLElement

  const el = document.createElement('bison-bank-crud')
  el.setAttribute('persona', scope.persona)
  el.setAttribute('scope-id', scope.id)
  ;(el as unknown as { client: unknown }).client = client

  page.append(h('div', { class: 'callout' }, [
    h('span', { html: 'Banking gates on onboarding: complete the business profile on the <strong>Onboarding</strong> page first, or adding an account returns a <code>422</code> eligibility error (you’ll see it in the ledger).' }),
  ]))
  page.append(h('div', { class: 'pg-bar' }, [
    h('span', { class: 'pg-bar__label' }, ['test data']),
    h('span', { class: 'chip' }, ['routing 021000021']),
    h('span', { class: 'chip chip--green' }, ['verify MV1234']),
    h('button', { class: 'btn', style: 'margin-left:auto', onClick: () => (el as unknown as { refresh(): void }).refresh() }, ['↻ refresh']),
  ]))
  page.append(h('div', { class: 'stage' }, [el]))
  return page
}

export function fnsPage(): HTMLElement {
  const page = head('bison-jib-sdk', 'Functions', 'Standalone async functions over the contract. Every one takes a scope; the client binds the transport. Build your own flow, or let the components drive them.') as HTMLElement
  page.append(section('Onboarding'))
  page.append(table(['Function', 'Returns', 'Notes'], D.onboardingFns.map((f) => [code(f.sig), code(f.ret), f.desc])))
  page.append(section('Banking'))
  page.append(table(['Function', 'Returns', 'Notes'], D.bankingFns.map((f) => [code(f.sig), code(f.ret), f.desc])))
  page.append(section('Onboarding routes'))
  page.append(h('p', { class: 'muted' }, ['{kyb} = <scope-base>/kyb  ·  scope-base ∈ { api/wios/{id}, api/wios/{id}/entities/{entityId}, api/operators/{id} }']))
  page.append(table(['Method', 'Path', 'Body', 'Returns'], routeRows(D.onboardingRoutes)))
  page.append(section('Banking routes'))
  page.append(h('p', { class: 'muted' }, ['{bank} = <scope-base>/bank-accounts']))
  page.append(table(['Method', 'Path', 'Body', 'Returns'], routeRows(D.bankingRoutes)))
  return page
}

export function validationPage(): HTMLElement {
  const page = head('bison-jib-sdk/validation', 'Validation rules', 'The platform’s exact zod schemas. Validate custom forms before calling core; the components use these too. Try the live validators below.') as HTMLElement
  page.append(section('Onboarding rules'))
  page.append(table(['Field', 'Rule', 'Message'], D.onboardingVal.map((v) => [code(v.name), code(v.rule), v.msg])))
  page.append(section('Banking rules'))
  page.append(table(['Field', 'Rule', 'Message'], D.bankingVal.map((v) => [code(v.name), code(v.rule), v.msg])))
  page.append(section('Try it — routing number (ABA checksum)'))
  liveValidators(page)
  return page
}

export function stylingPage(): HTMLElement {
  const page = head('bison-jib-sdk/components', 'Styling', 'Light DOM, zero CSS shipped. Four layers, each semver-governed: classes for styling, attributes for state, slots for structure, tokens for theming.') as HTMLElement

  page.append(section('Elements'))
  for (const e of D.elements) {
    page.append(h('div', { class: 'callout', style: 'border-left-color:var(--blue)' }, [
      h('code', { style: 'font-size:14px;color:var(--blue)' }, [`<${e.tag}>`]),
      h('p', { style: 'margin:.5rem 0 .5rem' }, [e.desc]),
      h('p', { class: 'muted', style: 'margin:0;font-size:12.5px' }, [
        h('strong', {}, ['attrs ']), e.attrs, '  ·  ',
        h('strong', {}, ['props ']), e.props,
      ]),
      h('p', { class: 'muted', style: 'margin:.35rem 0 0;font-size:12.5px' }, [h('strong', {}, ['events ']), e.events]),
    ]))
  }

  page.append(section('1 · Class contract'))
  page.append(table(['Block', 'Elements / modifiers'], D.classMap.map(([b, e]) => [code(b), code(e)])))
  page.append(section('2 · State attributes'))
  page.append(table(['Attribute', 'Values', 'On'], D.stateAttrs.map((r) => [code(r[0]), code(r[1]), r[2]])))
  page.append(section('3 · Slots'))
  page.append(table(['slot="…"', 'Lands', 'For'], D.slots.map((r) => [code(r[0]), r[1], r[2]])))
  page.append(section('4 · Design tokens'))
  page.append(table(['Token', 'Default', 'Controls'], D.tokens.map((r) => [code(r[0]), code(r[1]), r[2]])))
  page.append(section('Events'))
  page.append(table(['Event', 'detail', 'Group'], D.eventMap.map((r) => [code(r[0]), code(r[1]), h('span', { class: `chip chip--${r[2] === 'banking' ? 'green' : 'amber'}` }, [r[2]])])))
  return page
}

export function backendPage(): HTMLElement {
  const page = head('coordination', 'Backend contract', 'The mock transport is the executable contract. These are the routes, behaviors, and decisions the backend must confirm before the SDK runs against a real environment.') as HTMLElement
  page.append(section('Decisions needed'))
  page.append(h('ol', {}, [
    h('li', { html: '<strong>Auth model</strong> — server-side token exchange (Bison API key → short-lived client token) vs Auth0 pass-through. SDK is neutral; we recommend keys.' }),
    h('li', { html: '<strong>WIO endpoints under a non-session token</strong> — today WIO KYB/bank is JWT-session only; the SDK needs bearer-token access.' }),
    h('li', { html: '<strong>OTP on bank mutations</strong> — drop for token-scoped calls, or surface an OtpRequiredResponse event?' }),
  ].map((x) => (x.style.margin = '0 0 .6rem', x))))
  page.append(section('Behaviors the SDK depends on'))
  page.append(h('ul', {}, [
    'Section status flips NotStarted → Completed (no InProgress).',
    'Capabilities deferred until beneficial-owners submit.',
    'First bank account auto-promotes to default.',
    '422 eligibility with errorCode NON_US_ADDRESS / ADDRESS_NOT_SET.',
    '409 on duplicate manual bank add.',
    'Verify code accepts MV#### or 4 digits; wrong → 400.',
    'EIN/SSN pass-through; GET returns *Provided booleans for resume.',
    'Failures carry a stable machine-readable errorCode.',
  ].map((t) => h('li', { style: 'margin:0 0 .3rem' }, [t]))))
  page.append(h('div', { class: 'callout' }, [h('span', { html: 'Full detail lives in <code>bison-sdk/docs/BACKEND_ASKS.md</code>.' })]))
  return page
}

// ---------------------------------------------------------------------------
// Live widgets
// ---------------------------------------------------------------------------

function persona(el: HTMLElement): HTMLElement {
  const set = (p: string) => {
    el.setAttribute('persona', p)
    ;(el as unknown as { refresh(): void }).refresh?.()
    seg.querySelectorAll('button').forEach((b) => b.classList.toggle('is-on', b.textContent === p))
  }
  const seg = h('div', { class: 'seg' }, [
    h('button', { class: 'is-on', onClick: () => set('wio') }, ['wio']),
    h('button', { onClick: () => set('operator') }, ['operator']),
  ])
  return seg
}

function resetMock(el: HTMLElement): void {
  // Fresh mock state for a clean run.
  const c = createClient({ transport: mock() })
  ;(el as unknown as { client: unknown }).client = c
  ;(el as unknown as { refresh(): void }).refresh?.()
}

async function liveResume(page: HTMLElement): Promise<void> {
  const out = h('pre', {}, [h('code', {}, ['loading…'])])
  page.append(out)
  const tick = async () => {
    try {
      // no-step getStates resolves to the full status; the union widens to unknown here.
      const status = (await client.onboarding.getStates(scope)) as import('bison-jib-sdk').OnboardingStatus
      const step = resolveResumeStep(status)
      out.replaceChildren(h('code', {}, [
        `resolveResumeStep(status) → "${step}"\n`,
        `business=${status.businessProfileStatus}  officer=${status.controlOfficerStatus}  owners=${status.beneficialOwnersStatus}  volume=${status.processingVolumeStatus}\n`,
        `isComplete=${status.isComplete}`,
      ]))
    } catch { /* ignore */ }
  }
  tick()
  document.addEventListener('bison-submit-success', tick)
}

function liveValidators(page: HTMLElement): void {
  const input = h('input', { class: 'btn', style: 'width:14rem;font-family:var(--mono)', placeholder: '021000021', value: '021000021' }) as HTMLInputElement
  const out = h('span', { class: 'chip' }, ['—'])
  const run = () => {
    const ok = isValidAbaRouting(input.value.trim())
    out.className = `chip chip--${ok ? 'green' : 'red'}`
    out.textContent = input.value.trim() ? (ok ? 'valid ABA routing ✓' : 'invalid checksum ✗') : '—'
  }
  input.addEventListener('input', run)
  page.append(h('div', { class: 'pg-bar' }, [input, out]))
  run()
}
