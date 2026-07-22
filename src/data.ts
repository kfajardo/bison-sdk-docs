// Reference data for the docs — mirrors the real SDK surface (src extracted).
// Kept as data so pages render tables consistently and stay in sync by review.

export interface Fn { sig: string; ret: string; type: keyof typeof returnTypes; desc: string }

export const onboardingFns: Fn[] = [
  { sig: 'getUser(options?)', ret: 'UserInfo', type: 'UserInfo', desc: 'Load the user.' },
  { sig: 'getOnboardingStatus(scope)', ret: 'OnboardingStatus', type: 'OnboardingStatus', desc: 'Load the full onboarding status.' },
  { sig: 'getOnboardingSection(scope, step)', ret: 'OnboardingSectionData[Step] | null', type: 'OnboardingSectionData', desc: 'Load one saved onboarding section.' },
  { sig: 'submitOnboardingSection(scope, submission)', ret: 'SaveSectionResult', type: 'SaveSectionResult', desc: 'Submit one onboarding section.' },
  { sig: 'uploadOnboardingDocument(scope, file, purpose?)', ret: 'DocumentUploadResult', type: 'DocumentUploadResult', desc: 'Upload an onboarding document.' },
]

export const returnTypes = {
  UserInfo: `export interface UserInfo {
  id?: string
  email?: string
  moovAccountId?: string
  isOnboarded?: boolean
  pendingCapabilities?: CapabilityStatus[]
}

export interface CapabilityStatus {
  name: string
  status: 'enabled' | 'pending' | 'in-review' | 'disabled' | 'not_requested'
  disabledReason?: string
  currentlyDue?: string[]
  errors?: CapabilityError[]
}

export interface CapabilityError {
  requirement: string
  errorCode: string
  reason?: string
}`,
  OnboardingStatus: `export interface OnboardingStatus {
  entityId: string
  entityType: string
  businessProfileStatus: SectionStatus
  controlOfficerStatus: SectionStatus
  beneficialOwnersStatus: SectionStatus
  processingVolumeStatus: SectionStatus
  isComplete: boolean
  bankAccountEligibility?: BankAccountEligibility
  hasExternalAccount?: boolean
  capabilities?: CapabilityStatus[]
  isProfileLocked?: boolean
  isKybReady?: boolean
  verificationStatus?: 'verified' | 'pending' | 'action-required' | string
  documents?: KybDocumentInfo[]
  selectedPaymentMethods?: PaymentMethodKey[]
  controlOfficerRepresentativeId?: string
  ownerRepresentativeIds?: string[]
  readinessState?: string
  readinessMessage?: string
  missingInputs?: string[]
  validationIssues?: string[]
}

export type SectionStatus = 'NotStarted' | 'InProgress' | 'Completed'
export type PaymentMethodKey = 'cards' | 'ach' | 'wire' | 'rtp'

export interface BankAccountEligibility {
  isSupported?: boolean
  wioCountryCode?: string
  unsupportedReason?: string
  supportedCountryCodes?: string[]
}

export interface CapabilityStatus {
  name: string
  status: 'enabled' | 'pending' | 'in-review' | 'disabled' | 'not_requested'
  disabledReason?: string
  currentlyDue?: string[]
  errors?: CapabilityError[]
}

export interface CapabilityError {
  requirement: string
  errorCode: string
  reason?: string
}

export interface KybDocumentInfo {
  id?: string
  purpose: MoovFilePurpose
  status?: string
  fileName?: string
}

export type MoovFilePurpose =
  | 'merchant_underwriting'
  | 'identity_verification'
  | 'individual_verification'
  | 'representative_verification'
  | 'account_requirement'
  | 'business_verification'`,
  OnboardingSectionData: `export interface OnboardingSectionData {
  business: BusinessProfilePayload
  officer: ControlOfficerPayload
  owners: BeneficialOwnerPayload[]
  volume: ProcessingVolumePayload
  documents: KybDocumentInfo[]
}

export interface BusinessProfilePayload {
  legalBusinessName: string
  doingBusinessAs?: string
  ein?: string
  businessType: string
  industry?: string
  industryMcc?: string
  industryNaics?: string
  industrySic?: string
  description?: string
  website?: string
  phone: string
  email?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  country?: string
  zipCode: string
  selectedPaymentMethods?: PaymentMethodKey[]
  tosToken?: string
  incorporationState?: string
  termsAccepted?: boolean
  controlOfficer?: ControlOfficerPayload
}

export interface ControlOfficerPayload {
  firstName: string
  lastName: string
  jobTitle?: string
  email?: string
  phone?: string
  birthDay?: number
  birthMonth?: number
  birthYear?: number
  ssn?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  zipCode?: string
}

export interface BeneficialOwnerPayload extends ControlOfficerPayload {
  ownershipPercentage: number
}

export interface ProcessingVolumePayload {
  averageMonthlyTransactionCount: number
  averageMonthlyDollarVolume: number
  averageIndividualTransactionSize: number
  maximumIndividualTransactionSize?: number
  geographicReach?: string
  businessPresence?: string
  pendingLitigation?: string
  volumeShareByCustomerType?: {
    business: number
    consumer: number
    p2p: number
  }
}

export interface KybDocumentInfo {
  id?: string
  purpose: MoovFilePurpose
  status?: string
  fileName?: string
}

export type PaymentMethodKey = 'cards' | 'ach' | 'wire' | 'rtp'

export type MoovFilePurpose =
  | 'merchant_underwriting'
  | 'identity_verification'
  | 'individual_verification'
  | 'representative_verification'
  | 'account_requirement'
  | 'business_verification'`,
  SaveSectionResult: `export interface SaveSectionResult {
  success: boolean
  moovAccountId?: string
  representativeId?: string
  errorMessage?: string
}`,
  DocumentUploadResult: `export interface DocumentUploadResult {
  id?: string
  purpose: MoovFilePurpose
  status?: string
}

export type MoovFilePurpose =
  | 'merchant_underwriting'
  | 'identity_verification'
  | 'individual_verification'
  | 'representative_verification'
  | 'account_requirement'
  | 'business_verification'`,
} as const

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

export const partialOnboardingVal: ValRule[] = [
  { name: 'corporationName', rule: 'trim, 1–100', msg: 'Enter the corporation name' },
  { name: 'website', rule: 'optional hostname or http(s) URL', msg: 'Enter a valid website or leave it blank' },
  { name: 'phone', rule: '/^\\(\\d{3}\\) \\d{3}-\\d{4}$/', msg: 'Enter a 10-digit business phone number' },
  { name: 'address', rule: 'line 1, city, state required; ZIP /^\\d{5}$/', msg: 'Street address / city / state / 5-digit ZIP required' },
  { name: 'ein', rule: '/^\\d{2}-\\d{7}$/ or already provided', msg: 'Enter a 9-digit EIN (XX-XXXXXXX)' },
  { name: 'leadership.legalName', rule: 'at least two name parts', msg: 'Enter the full legal name' },
  { name: 'birthDate', rule: '/^\\d{4}-\\d{2}-\\d{2}$/ or already provided', msg: 'Enter a valid date of birth' },
  { name: 'taxId', rule: '/^\\d{3}-\\d{2}-\\d{4}$/ or already provided', msg: 'Enter a 9-digit SSN or ITIN (XXX-XX-XXXX)' },
  { name: 'ownershipPercentage', rule: 'number 25–100', msg: 'Enter a percentage between 25 and 100' },
  { name: 'ownership', rule: 'list every 25%+ owner or certify none; confirm completed list', msg: 'Confirm that all qualifying owners are listed' },
  { name: 'termsAccepted', rule: 'must be checked', msg: 'Accept the payment services terms' },
]

export const bankingVal: ValRule[] = [
  { name: 'routingNumber', rule: '/^\\d{9}$/ + ABA checksum', msg: 'Invalid routing number' },
  { name: 'accountNumber', rule: 'digits, 4–20, not all zeros', msg: 'Account number is too short / too long' },
  { name: 'holderName', rule: 'required', msg: 'Account holder name is required' },
  { name: 'accountType', rule: "enum('checking','savings')", msg: '—' },
  { name: 'verification code', rule: '/^MV\\d{4}$/i (or 4 digits)', msg: 'normalizeVerificationCode strips MV' },
]

export type ApiMember = readonly [name: string, description: string]
export type ApiGroup = { intro: string; members: readonly ApiMember[] }
export type ComponentApi = Record<'attributes' | 'properties' | 'events' | 'types', ApiGroup>

const scopedAttributes: ApiMember[] = [
  ['persona', 'Selects the account route. Use operator for an operator account; any other value defaults to wio.'],
  ['scope-id', 'Identifies the WIO or operator whose data the component loads and changes.'],
  ['entity-id', 'Narrows a WIO request to one sub-entity. Omit it for account-level onboarding.'],
  ['base-url', 'Sets the API origin when you do not assign a shared .client property.'],
]

const submitEvents: ApiMember[] = [
  ['bison-before-submit', 'Fires after validation and before the request. Cancel it to take over submission; detail is OnboardingSubmit.'],
  ['bison-submit-success', 'Confirms a saved section. Detail contains the step and API result.'],
  ['bison-submit-error', 'Reports a failed section request. Detail contains the thrown error.'],
]

export const publicApi: Record<'onboarding' | 'partial' | 'bank', ComponentApi> = {
  onboarding: {
    attributes: {
      intro: 'Use attributes for configuration that is known in HTML before the component connects.',
      members: [
        ...scopedAttributes,
        ['prefill', 'Accepts JSON initial values grouped by onboarding section. It is read when the element connects.'],
        ['labels', 'Accepts JSON replacements for section titles and state descriptions announced by screen readers. State descriptions are not shown visually. It is read when the element connects.'],
      ],
    },
    properties: {
      intro: 'Use properties for typed values, shared services, or changes after the component has mounted.',
      members: [
        ['.client', 'Shares an authenticated Bison client with the component. Set this instead of base-url when your app manages authentication.'],
        ['.prefill', 'Sets typed initial values and rerenders the form. Values already held by the server take priority.'],
        ['.labels', 'Changes section titles and the state descriptions in each header’s accessible name, then rerenders the component. State descriptions are not shown visually.'],
        ['.refresh()', 'Reloads onboarding status, opens the correct resume section, and rerenders.'],
      ],
    },
    events: {
      intro: 'Listen for these bubbling events when the surrounding product needs to react to progress or submission.',
      members: [
        ['bison-step-change', 'Fires when the user opens an available section. Detail contains the selected step.'],
        ['bison-status-checked', 'Fires after refresh loads the latest onboarding status. Detail is the full OnboardingStatus.'],
        ...submitEvents,
      ],
    },
    types: {
      intro: 'Import these TypeScript types when configuring the component or handling its events.',
      members: [
        ['OnboardingPrefill', 'The field values accepted by .prefill, grouped by section.'],
        ['OnboardingLabels', 'The supported section-title overrides and screen-reader-only state descriptions.'],
        ['SectionUiState', 'The locked, active, done, and error states exposed through data-state.'],
        ['BisonSectionClient', 'The client contract accepted by .client.'],
      ],
    },
  },
  partial: {
    attributes: {
      intro: 'Use attributes to identify the account and API origin before the compact flow connects.',
      members: [
        ...scopedAttributes,
        ['terms-url', 'Optional Bison-hosted payment-services terms URL. Without it, the branded disclosure remains plain text.'],
      ],
    },
    properties: {
      intro: 'Use the client property when your app manages authentication or shares one SDK connection.',
      members: [
        ['.client', 'Provides the Bison client used for onboarding and one built-in manual bank-account submission.'],
      ],
    },
    events: {
      intro: 'Listen for these bubbling events to track progress, saved sections, failures, and final completion.',
      members: [
        ['bison-status-checked', 'Fires after the component checks whether a provider entity already exists. Detail is OnboardingStatus.'],
        ['bison-submit-success', 'Confirms a business, officer, or owners save. Detail contains the section and result.'],
        ['bison-submit-error', 'Reports a failed status or section request. Detail contains the thrown error.'],
        ['bison-partial-complete', 'Fires after the required partial onboarding requests all succeed.'],
        ['bison-bank-added', 'Confirms manual bank-account registration. Detail contains the account result.'],
        ['bison-bank-error', 'Reports a bank-account submission failure.'],
      ],
    },
    types: {
      intro: 'Import the shared client type when storing or injecting the client separately.',
      members: [
        ['BisonSectionClient', 'The client contract accepted by .client.'],
        ['PartialOnboardingValues', 'The nested contact, incorporation, leadership, ownership, and consent value shape.'],
        ['PartialOnboardingErrors', 'Field messages returned by the exported partial onboarding validators.'],
      ],
    },
  },
  bank: {
    attributes: {
      intro: 'Use attributes to identify the account and API origin before the component connects.',
      members: scopedAttributes,
    },
    properties: {
      intro: 'Use properties to share authentication, connect Plaid, or reload accounts after an outside change.',
      members: [
        ['.client', 'Shares an authenticated Bison client with the component.'],
        ['.onPlaidLink', 'Receives a link token and opens your Plaid Link flow. Return the selected account or null when the user cancels.'],
        ['.refresh()', 'Reloads the bank-account list and rerenders rows, badges, and available actions.'],
      ],
    },
    events: {
      intro: 'Listen for these bubbling events to update the surrounding product after a bank-account action.',
      members: [
        ['bison-bank-added', 'Confirms manual or Plaid registration. Detail contains the method and account result.'],
        ['bison-bank-verified', 'Confirms micro-deposit verification. Detail contains the account id.'],
        ['bison-bank-default-changed', 'Confirms a new default account. Detail contains the account id.'],
        ['bison-bank-deleted', 'Confirms account removal. Detail contains the account id.'],
        ['bison-bank-error', 'Reports a banking failure or guarded action. Detail contains a code and message.'],
      ],
    },
    types: {
      intro: 'Import these TypeScript types when implementing the Plaid handoff.',
      members: [
        ['PlaidLinkHook', 'The async function signature assigned to .onPlaidLink.'],
        ['PlaidLinkResult', 'The Plaid account details the hook returns for registration.'],
      ],
    },
  },
}

export const classMap = [
  ['bison-onboarding', '__section (--<step>) · __section-header / -title / -body · __form · __button (--next/--add/--remove/--upload) · __documents · __error'],
  ['bison-field', '__label __input __error · --<fieldName> · --invalid'],
  ['bison-partial', '__form · __section (--contact/--incorporation/--leadership/--ownership/--consent/--banking) · __banking · __owner(s) · __checkbox · __nav · __button (--add-owner/--add-leadership/--remove-owner/--submit) · __error'],
  ['bison-bank-accounts', '__list · __row / -main / -actions · __bank-name · __account-number · __badge (--verified/--default) · __button (--verify/--default/--delete/--cancel) · __form · __verify'],
]

export type StateAttribute = { name: string; target: string; values: readonly ApiMember[] }

export const stateAttrs: Record<'onboarding' | 'partial' | 'bank', readonly StateAttribute[]> = {
  onboarding: [
    {
      name: 'data-state',
      target: 'Each onboarding section',
      values: [
        ['locked', 'The business profile must be completed before this section becomes available.'],
        ['active', 'The section is available and still needs information or submission.'],
        ['done', 'The backend reports this section as completed.'],
        ['error', 'A capability requirement points to this section and needs user action.'],
      ],
    },
    {
      name: 'data-step',
      target: 'The onboarding root and each section',
      values: [
        ['business', 'Business identity, contact details, tax ID, and address.'],
        ['officer', 'The responsible control officer’s identity and contact details.'],
        ['owners', 'One or more beneficial owners and their ownership percentages.'],
        ['volume', 'Expected monthly and per-transaction processing amounts.'],
        ['documents', 'Supporting documents and bank-account setup.'],
      ],
    },
  ],
  partial: [
    {
      name: 'aria-invalid',
      target: 'A partial onboarding field or the terms checkbox after validation',
      values: [
        ['true', 'The current value failed validation and an error message is shown.'],
        ['false', 'The current value passed validation. Before validation, the attribute is absent.'],
      ],
    },
  ],
  bank: [
    {
      name: 'data-provider',
      target: 'The add-account controls',
      values: [
        ['none', 'No add method is selected; the user sees the available choices.'],
        ['plaid', 'Plaid linking is the selected add-account path.'],
        ['manual', 'The manual routing and account-number form is open.'],
      ],
    },
    {
      name: 'data-verified',
      target: 'Each bank-account row',
      values: [
        ['verified', 'Ownership verification is complete.'],
        ['unverified', 'Verification is still required, so the Verify action is available.'],
      ],
    },
    {
      name: 'data-default',
      target: 'A bank-account row only when it is the default',
      values: [['default', 'This account is used as the default and cannot be deleted until another account replaces it.']],
    },
  ],
}

export const slots = [
  ['header', 'above the step list', 'brand / intro content'],
  ['section-intro:<step>', 'above a section’s fields', 'per-section guidance'],
  ['actions', 'replaces the button row', 'custom navigation'],
  ['empty-state', 'bank accounts, no accounts', 'custom empty message'],
  ['done', 'completion panel', 'custom success content'],
]

export const tokens = [
  ['--bison-accent', '#b45309', 'primary action color'],
  ['--bison-error', '#c62828', 'invalid fields and error states'],
  ['--bison-success', '#1b7a43', 'completed fields and badges'],
  ['--bison-warning', '#b7791f', 'attention states'],
  ['--bison-bg', '#ffffff', 'component background'],
  ['--bison-surface', '#f6f8fa', 'panels and fields'],
  ['--bison-surface-raised', '#ffffff', 'elevated panels'],
  ['--bison-text', '#1c2530', 'primary copy'],
  ['--bison-text-muted', '#5b6875', 'supporting copy'],
  ['--bison-border', '#d8dee6', 'field and card borders'],
  ['--bison-border-strong', '#b7c0cb', 'emphasized controls'],
  ['--bison-radius', '8px', 'component corners'],
  ['--bison-radius-sm', '5px', 'control corners'],
  ['--bison-radius-pill', '999px', 'badges'],
  ['--bison-gap', 'spacing', 'layout gaps'],
  ['--bison-pad', 'spacing', 'component padding'],
  ['--bison-field-h', 'control height', 'form fields'],
  ['--bison-focus-ring', '#d97706', 'keyboard focus'],
]

export const eventMap = [
  ['bison-step-change', '{ step }', 'onboarding'],
  ['bison-status-checked', 'OnboardingStatus', 'onboarding + partial'],
  ['bison-before-submit', 'OnboardingSubmit — cancelable', 'onboarding'],
  ['bison-submit-success', '{ step, result }', 'onboarding + partial'],
  ['bison-submit-error', 'BisonApiError | Error', 'onboarding + partial'],
  ['bison-partial-complete', '—', 'partial'],
  ['bison-bank-added', '{ method, account | result }', 'partial + banking'],
  ['bison-bank-verified', '{ id }', 'banking'],
  ['bison-bank-default-changed', '{ id }', 'banking'],
  ['bison-bank-deleted', '{ id }', 'banking'],
  ['bison-bank-error', '{ code?, message }', 'partial + banking'],
]
