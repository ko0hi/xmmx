import { Market } from 'ccxt'
import { ccxtMarketsApiHandler } from '~/server/api/v1/markets/ccxt.get'

export default defineEventHandler<Market[]>(ccxtMarketsApiHandler)
