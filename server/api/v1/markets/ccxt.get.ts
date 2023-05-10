import { Market } from 'ccxt'
import createClient from '~/utils/ccxt'
import { H3Event } from 'h3'

export const ccxtMarketsApiHandler = async (event: H3Event) => {
  const { exchange } = getQuery(event)
  if (!exchange) throw TypeError('exchange is required')
  return await createClient(exchange.toString()).fetchMarkets()
}

export default defineEventHandler<Market[]>(ccxtMarketsApiHandler)
