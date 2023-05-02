import { describe, it, expect } from 'vitest'
import { createClient } from './factory'
import { UnsupportedExchangeError } from '../exceptions'

describe('ccxt factory', () => {
  it('should raise UnsupportedExchangeError', () => {
    expect(() => createClient('xxx')).toThrow(UnsupportedExchangeError)
  })
})
