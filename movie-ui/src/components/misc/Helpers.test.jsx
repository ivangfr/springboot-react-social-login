import { describe, it, expect, vi, beforeEach } from 'vitest'
import { parseJwt, getSocialLoginUrl, handleLogError } from './Helpers'

// In test env NODE_ENV === 'test', config resolves to prod URLs
const API_BASE_URL = 'https://mybeapp.herokuapp.com'
const OAUTH2_REDIRECT_URI = 'https://myfeapp.herokuapp.com/oauth2/redirect'

// Helper: build a real base64url-encoded JWT payload
function makeToken(payload) {
  const json = JSON.stringify(payload)
  const base64 = btoa(json)
  // A minimal valid-looking JWT: header.payload.signature
  return `header.${base64}.signature`
}

describe('parseJwt', () => {
  it('returns undefined when token is falsy', () => {
    expect(parseJwt(undefined)).toBeUndefined()
    expect(parseJwt(null)).toBeUndefined()
    expect(parseJwt('')).toBeUndefined()
  })

  it('decodes a valid JWT payload', () => {
    const payload = { sub: 'user1', exp: 9999999999, rol: ['USER'] }
    const token = makeToken(payload)
    const result = parseJwt(token)
    expect(result.sub).toBe('user1')
    expect(result.exp).toBe(9999999999)
    expect(result.rol).toEqual(['USER'])
  })

  it('decodes a JWT with name and role fields', () => {
    const payload = { name: 'Alice', rol: ['ADMIN'], exp: 9999999999 }
    const token = makeToken(payload)
    const result = parseJwt(token)
    expect(result.name).toBe('Alice')
    expect(result.rol[0]).toBe('ADMIN')
  })
})

describe('getSocialLoginUrl', () => {
  it('returns correct github OAuth2 URL', () => {
    const url = getSocialLoginUrl('github')
    expect(url).toBe(
      `${API_BASE_URL}/oauth2/authorization/github?redirect_uri=${OAUTH2_REDIRECT_URI}`
    )
  })

  it('returns correct google OAuth2 URL', () => {
    const url = getSocialLoginUrl('google')
    expect(url).toBe(
      `${API_BASE_URL}/oauth2/authorization/google?redirect_uri=${OAUTH2_REDIRECT_URI}`
    )
  })
})

describe('handleLogError', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('logs error.response.data when response is present', () => {
    const error = { response: { data: { message: 'Not found' } } }
    handleLogError(error)
    expect(console.log).toHaveBeenCalledWith({ message: 'Not found' })
  })

  it('logs error.request when no response but request present', () => {
    const error = { request: 'some request object' }
    handleLogError(error)
    expect(console.log).toHaveBeenCalledWith('some request object')
  })

  it('logs error.message when neither response nor request present', () => {
    const error = { message: 'Network Error' }
    handleLogError(error)
    expect(console.log).toHaveBeenCalledWith('Network Error')
  })
})
