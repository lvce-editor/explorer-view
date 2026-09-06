import { expect, test } from '@jest/globals'
import * as GetErrorCode from '../src/parts/GetErrorCode/GetErrorCode.ts'

test('getErrorCode - returns code from object error', () => {
  const error = {
    code: 'ENOENT',
  }
  expect(GetErrorCode.getErrorCode(error)).toBe('ENOENT')
})

test('getErrorCode - returns numeric codes', () => {
  const error = {
    code: 404,
  }
  expect(GetErrorCode.getErrorCode(error)).toBe('404')
})

test('getErrorCode - returns empty string for null', () => {
  expect(GetErrorCode.getErrorCode(null)).toBe('')
})

test('getErrorCode - follows wrapped causes and prefers the outer code', () => {
  const cause = Object.assign(new Error('failed'), { code: 'E_REMOTE_BACKEND_WEBSOCKET_ERROR' })
  const error = new Error('Could not read directory', { cause })
  expect(GetErrorCode.getErrorCode(error)).toBe(cause.code)
  expect(GetErrorCode.getErrorCode(Object.assign(error, { code: 'E_READ_DIRECTORY' }))).toBe('E_READ_DIRECTORY')
})

test('getErrorCode - handles cyclic causes, empty codes and numeric zero', () => {
  const error = { cause: undefined as unknown, code: '' }
  error.cause = error
  expect(GetErrorCode.getErrorCode(error)).toBe('')
  expect(GetErrorCode.getErrorCode({ code: 0 })).toBe('0')
})
