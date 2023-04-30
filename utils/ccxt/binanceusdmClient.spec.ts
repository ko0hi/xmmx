import { describe, it, expect } from 'vitest'
import { createClient } from './factory'

describe('binanceudmClient', async () => {
  it('should be able to create a client', () => {
    const client = createClient('binanceusdm')
    expect(client.getExchange().name).toBe('Binance USDⓈ-M')
  })
})
