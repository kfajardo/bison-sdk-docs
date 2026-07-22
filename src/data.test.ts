import { expect, test } from 'bun:test'
import { onboardingFns, returnTypes } from './data'

test('documents every function return shape', () => {
  expect(onboardingFns.every(({ type }) => returnTypes[type].startsWith('export '))).toBe(true)
})
