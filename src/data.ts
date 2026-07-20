// Reference data for the docs — mirrors the real SDK surface (src extracted).
// Kept as data so pages render tables consistently and stay in sync by review.

export interface Route {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  body?: string
  returns: string
  note?: string
}

export const onboardingRoutes: Route[] = [
  { method: 'GET', path: '{kyb}/status', returns: 'OnboardingStatus' },
  { method: 'POST', path: '{kyb}/business-profile', body: 'BusinessProfilePayload', returns: 'SaveSectionResult', note: 'Creates the Moov account on first call' },
  { method: 'POST', path: '{kyb}/control-officer', body: 'ControlOfficerPayload', returns: 'SaveSectionResult', note: '?existingRepresentativeId=' },
  { method: 'POST', path: '{kyb}/beneficial-owners', body: 'BeneficialOwnerPayload[]', returns: 'SaveSectionResult', note: '?noOwnersAbove25=' },
  { method: 'POST', path: '{kyb}/processing-volume', body: 'ProcessingVolumePayload', returns: 'SaveSectionResult' },
  { method: 'POST', path: '{kyb}/documents', body: 'multipart (file, purpose)', returns: 'DocumentUploadResult' },
  { method: 'POST', path: '{kyb}/payment-method-capabilities', body: '{ selectedPaymentMethods }', returns: 'void' },
  { method: 'GET', path: 'api/{wios|operators}/kyb/industries', returns: 'Industry[]' },
  { method: 'POST', path: 'api/moov/tos-token', returns: '{ accessToken }' },
]

export const bankingRoutes: Route[] = [
  { method: 'GET', path: '{bank}', returns: 'BankAccount[]' },
  { method: 'POST', path: '{bank}/manual', body: 'ManualBankAccountPayload', returns: 'BankAccount', note: 'Moov only; auto-initiates micro-deposits' },
  { method: 'POST', path: '{bank}/{id}/initiate-verification', returns: 'void' },
  { method: 'POST', path: '{bank}/{id}/complete-verification', body: '{ code }', returns: 'void' },
  { method: 'PUT', path: '{bank}/{id}/set-default', returns: 'void' },
  { method: 'DELETE', path: '{bank}/{id}', returns: 'void' },
  { method: 'POST', path: 'api/plaid/embeddable/create-token', returns: '{ linkToken }', note: '?entityId=' },
  { method: 'POST', path: 'api/plaid/embeddable/register-bank-account', body: 'PlaidRegisterPayload', returns: 'PlaidRegisterResult' },
]

export interface Fn { sig: string; ret: string; desc: string }

export const onboardingFns: Fn[] = [
  { sig: 'onboarding.getUser(opts?)', ret: 'UserInfo', desc: 'Current user; with { email } resolves via moov-account-id, else GET api/auth/me.' },
  { sig: 'onboarding.getStates(scope, step?)', ret: 'OnboardingStatus | section', desc: 'No step → full KYB status. With step → that section’s saved data.' },
  { sig: 'onboarding.submit(scope, { step, data })', ret: 'SaveSectionResult', desc: 'By-step submit. Ordering matters: business → officer → owners defers capabilities.' },
  { sig: 'onboarding.uploadDocument(scope, file, purpose?)', ret: 'DocumentUploadResult', desc: 'Multipart KYB document upload (default purpose merchant_underwriting).' },
  { sig: 'onboarding.getIndustries(scope)', ret: 'Industry[]', desc: 'Moov industry list for the business-profile dropdown.' },
  { sig: 'onboarding.getTosToken()', ret: 'TosToken', desc: 'Moov terms-of-service token for account creation.' },
  { sig: 'onboarding.savePaymentMethodCapabilities(scope, methods)', ret: 'void', desc: 'Persist selected methods (cards/ach/wire/rtp) and request capabilities.' },
  { sig: 'resolveResumeStep(status)', ret: 'OnboardingStep', desc: 'Where the user should pick up: business-first lock, action_required wins, else first incomplete.' },
]

export const bankingFns: Fn[] = [
  { sig: 'banking.list(scope)', ret: 'BankAccount[]', desc: 'All bank accounts for the scope.' },
  { sig: 'banking.getPlaidToken(scope)', ret: 'PlaidLinkToken', desc: 'Link token to open Plaid Link.' },
  { sig: 'banking.register(scope, payload)', ret: 'BankAccount | PlaidRegisterResult', desc: 'Discriminated: { method: "manual" } or { method: "plaid" }.' },
  { sig: 'banking.initiateVerification(scope, id)', ret: 'void', desc: 'Re-send micro-deposits (retry path).' },
  { sig: 'banking.completeVerification(scope, id, { code })', ret: 'void', desc: 'Verify with MV#### or 4 digits.' },
  { sig: 'banking.setDefault(scope, id)', ret: 'void', desc: 'Promote an account to default.' },
  { sig: 'banking.delete(scope, id)', ret: 'void', desc: 'Remove an account. Guards (default/last) are client-side.' },
]

export interface ValRule { name: string; rule: string; msg: string }

export const onboardingVal: ValRule[] = [
  { name: 'legalBusinessName', rule: 'trim, 1–64, allowed-chars', msg: 'Required' },
  { name: 'ein', rule: '/^\\d{2}-\\d{7}$/', msg: 'Must be in format XX-XXXXXXX' },
  { name: 'description', rule: 'min 10, max 100', msg: 'Must be at least 10 characters' },
  { name: 'phone', rule: 'digits length === 10', msg: 'Must be 10 digits' },
  { name: 'addressLine1', rule: 'max 60, no PO Box', msg: 'P.O. Box addresses are not permitted…' },
  { name: 'ssn', rule: '/^\\d{3}-\\d{2}-\\d{4}$/', msg: 'Must be in format XXX-XX-XXXX' },
  { name: 'dateOfBirth', rule: 'age ≥ 18', msg: 'Must be at least 18 years old' },
  { name: 'ownershipPercentage', rule: 'integer 25–100', msg: 'Must be a whole number between 25 and 100' },
  { name: 'state (US)', rule: 'valid US state', msg: 'State must be a valid US state.' },
  { name: 'volumeShareByCustomerType', rule: 'business+consumer+p2p === 100', msg: 'Volume share by customer type must total 100' },
]

export const bankingVal: ValRule[] = [
  { name: 'routingNumber', rule: '/^\\d{9}$/ + ABA checksum', msg: 'Invalid routing number' },
  { name: 'accountNumber', rule: 'digits, 4–20, not all zeros', msg: 'Account number is too short / too long' },
  { name: 'holderName', rule: 'required', msg: 'Account holder name is required' },
  { name: 'accountType', rule: "enum('checking','savings')", msg: '—' },
  { name: 'verification code', rule: '/^MV\\d{4}$/i (or 4 digits)', msg: 'normalizeVerificationCode strips MV' },
]

export const elements = [
  {
    tag: 'bison-onboarding',
    attrs: 'persona · scope-id · entity-id? · base-url',
    events: 'bison-step-change · bison-status-checked · bison-before-submit (cancelable) · bison-submit-success · bison-submit-error',
    props: '.client · .refresh()',
    desc: 'The 5-section KYB accordion with real gating (business-first lock, resume auto-open, action_required from capability errors). Embeds bison-bank-crud once business profile is complete.',
  },
  {
    tag: 'bison-onboarding-step',
    attrs: 'step · persona · scope-id · entity-id? · base-url',
    events: 'bison-before-submit (cancelable) · bison-submit-success · bison-submit-error',
    props: '.client · .value · .validate()',
    desc: 'One section standalone — the "partial onboarding" surface (e.g. a WIO completing a single section an operator’s flow depends on).',
  },
  {
    tag: 'bison-bank-crud',
    attrs: 'persona · scope-id · entity-id? · base-url',
    events: 'bison-bank-added · bison-bank-verified · bison-bank-default-changed · bison-bank-deleted · bison-bank-error',
    props: '.client · .onPlaidLink · .refresh()',
    desc: 'List / add (Plaid or manual) / micro-deposit verify / set-default / delete, with frontend-only delete guards (can’t delete default or last account).',
  },
]

export const classMap = [
  ['bison-onboarding', '__steps __section __form __actions __button (--back/--next/--add/--remove) __error __done-message'],
  ['bison-field', '__label __input __error · --<fieldName> · --invalid'],
  ['bison-step', '--<stepId>'],
  ['bison-bank-crud', '__list __row __bank-name __last4 __badge (--verified/--default) __button (--default/--delete) __empty-state __dialog'],
]

export const stateAttrs = [
  ['data-state', 'locked | active | done | error', 'section / step card state'],
  ['data-step', 'business | officer | owners | volume | documents', 'which section a node belongs to'],
  ['data-provider', 'plaid | manual | none', 'bank add mode'],
  ['data-verified / data-default', 'boolean', 'bank row flags'],
]

export const slots = [
  ['header', 'above the step list', 'brand / intro content'],
  ['section-intro:<step>', 'above a section’s fields', 'per-section guidance'],
  ['actions', 'replaces the button row', 'custom navigation'],
  ['empty-state', 'bank-crud, no accounts', 'custom empty message'],
  ['done', 'completion panel', 'custom success content'],
]

export const tokens = [
  ['--bison-accent', '#3b5bdb', 'primary action color'],
  ['--bison-error / --success / --warning', 'state colors', 'field + badge status'],
  ['--bison-bg / -surface / -surface-raised', 'backgrounds', 'panels and fields'],
  ['--bison-text / -text-muted', 'ink', 'copy'],
  ['--bison-border / -border-strong', 'lines', 'field + card borders'],
  ['--bison-radius (-sm / -pill)', '8px / 5px / 999px', 'corner rounding'],
  ['--bison-gap / -pad / -field-h', 'spacing', 'layout rhythm'],
  ['--bison-focus-ring', 'accent', 'keyboard focus'],
]

export const eventMap = [
  ['bison-step-change', '{ index, step }', 'onboarding'],
  ['bison-status-checked', 'OnboardingStatus', 'onboarding'],
  ['bison-before-submit', '{ step, data } — cancelable', 'onboarding'],
  ['bison-submit-success', 'SaveSectionResult', 'onboarding'],
  ['bison-submit-error', 'BisonApiError | Error', 'onboarding'],
  ['bison-bank-added', 'BankAccount', 'banking'],
  ['bison-bank-verified', '{ id }', 'banking'],
  ['bison-bank-default-changed', '{ id }', 'banking'],
  ['bison-bank-deleted', '{ id }', 'banking'],
  ['bison-bank-error', '{ code?, message }', 'banking'],
]
