/* eslint-disable */
const {
  encodeSqrtRatioX96,
  // FeeAmount,
  nearestUsableTick,
  priceToClosestTick,
  TICK_SPACINGS,
} = require('@uniswap/v3-sdk/dist/')
const { TickMath, tickToPrice } = require('@uniswap/v3-sdk')
const JSBI = require('jsbi')
const { Currency, CurrencyAmount, Price, Token } = require('@uniswap/sdk-core')

export function tryParseTick(baseToken, quoteToken, feeAmount, value) {
  console.log('baseToken', baseToken)
  console.log('quoteToken', quoteToken)
  console.log('feeAmount', feeAmount)
  console.log('value', value)
  if (!baseToken || !quoteToken || !feeAmount || !value) {
    return undefined
  }

  const [token0, token1] = baseToken.sortsBefore(quoteToken)
    ? [baseToken, quoteToken]
    : [quoteToken, baseToken]

  const invertPrice = Boolean(baseToken && token0 && !baseToken.equals(token0))
  console.log('invertPrice', invertPrice)

  const price = tryParsePrice(token0, token1, value)
  console.log('tryParsePrice', price)
  console.log('value', value)
  
  if (!price) {
    return undefined
  }

  let tick

  // check price is within min/max bounds, if outside return min/max
  const sqrtRatioX96 = encodeSqrtRatioX96(price.numerator, price.denominator)

  if (JSBI.greaterThanOrEqual(sqrtRatioX96, TickMath.MAX_SQRT_RATIO)) {
    tick = TickMath.MAX_TICK
  } else if (JSBI.lessThanOrEqual(sqrtRatioX96, TickMath.MIN_SQRT_RATIO)) {
    tick = TickMath.MIN_TICK
  } else {
    // this function is agnostic to the base, will always return the correct tick
    tick = priceToClosestTick(price)
  }

  return nearestUsableTick(tick, TICK_SPACINGS[feeAmount])
}

export function tryParsePrice(baseToken, quoteToken, value) {
  if (!baseToken || !quoteToken || !value) {
    return undefined
  }

  if (!value.match(/^\d*\.?\d+$/)) {
    return undefined
  }

  const [whole, fraction] = value.split('.')

  const decimals = fraction?.length ?? 0
  const withoutDecimals = JSBI.BigInt((whole ?? '') + (fraction ?? ''))

  return new Price(
    baseToken,
    quoteToken,
    JSBI.multiply(
      JSBI.BigInt(10 ** decimals),
      JSBI.BigInt(10 ** baseToken.decimals)
    ),
    JSBI.multiply(withoutDecimals, JSBI.BigInt(10 ** quoteToken.decimals))
  )
}
