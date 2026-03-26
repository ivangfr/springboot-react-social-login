import * as matchers from '@testing-library/jest-dom/matchers'
import { expect, afterEach, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'

expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// window.matchMedia mock (required by Mantine)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// Full in-memory localStorage mock (jsdom's stub is incomplete)
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value) },
    removeItem: (key) => { delete store[key] },
    clear: () => { store = {} },
    get length() { return Object.keys(store).length },
    key: (i) => Object.keys(store)[i] ?? null,
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

beforeEach(() => {
  localStorageMock.clear()
})
