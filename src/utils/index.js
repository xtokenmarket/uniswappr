import { Token } from '@uniswap/sdk-core'
import { tickToPrice } from '@uniswap/v3-sdk'

const formatNumber = (price) => {
  return parseFloat(Number(price).toFixed(10))
}

export const getPriceRange = (poolData) => {
  const { token0, token1, ticks, poolFee, chainId } = poolData
  const { tick0, tick1 } = ticks

  const numberPoolFee = Number(poolFee)
  const numberTick0 = Number(tick0)
  const numberTick1 = Number(tick1)

  if (
    (numberPoolFee === 500 &&
      numberTick0 == -887270 &&
      numberTick1 === 887270) ||
    (numberPoolFee === 3000 &&
      numberTick0 == -887220 &&
      numberTick1 === 887220) ||
    (numberPoolFee === 10000 &&
      numberTick0 == -887200 &&
      numberTick1 === 887200)
  ) {
    return '0 to INF'
  }

  const { priceLower, priceUpper } = getPriceFromTicks(
    numberTick0,
    numberTick1,
    token0,
    token1,
    chainId
  )

  return `${formatNumber(priceLower.toSignificant(8))} ${token0.symbol} per ${
    token1.symbol
  } to ${formatNumber(priceUpper.toSignificant(8))} ${token0.symbol} per ${
    token1.symbol
  }`
}

export const getPriceFromTicksFormatted = (
  tickLower,
  tickUpper,
  _token0,
  _token1,
  chainId
) => {
  const { priceLower, priceUpper } = getPriceFromTicks(
    tickLower,
    tickUpper,
    _token0,
    _token1,
    chainId
  )
  return `${formatNumber(priceLower.toSignificant(8))} ${_token1.symbol} per ${
    _token0.symbol
  } to ${formatNumber(priceUpper.toSignificant(8))} ${_token1.symbol} per ${
    _token0.symbol
  }`
}

export const getPriceFromTicks = (
  tickLower,
  tickUpper,
  _token0,
  _token1,
  chainId
) => {
  const token0 = new Token(
    chainId,
    _token0.address,
    Number(_token0.decimals),
    _token0.symbol,
    _token0.name
  )
  const token1 = new Token(
    chainId,
    _token1.address,
    Number(_token1.decimals),
    _token1.symbol,
    _token1.name
  )

  const priceLower = tickToPrice(token0, token1, tickLower)
  const priceUpper = tickToPrice(token0, token1, tickUpper)

  return {
    priceLower,
    priceUpper,
  }
}

export const showFeeTier = (fee) => {
  const mapping = {
    10000: '1%',
    3000: '0.3%',
    500: '0.05%',
    100: '0.01%',
  }
  return mapping[fee]
}

export const showNetworkName = (chainId) => {
  const mapping = {
    1: 'Ethereum',
    10: 'Optimism',
    137: 'Polygon',
    42161: 'Arbitrum',
  }
  return mapping[chainId]
}

export const chainIdToAlchemyUrl = (chainId) => {
  console.log('chainId**', chainId)
  const mapping = {
    1: 'mainnet',
    10: 'opt-mainnet',
    137: 'polygon-mainnet',
    42161: 'arb-mainnet',
  }
  return mapping[chainId]
}
