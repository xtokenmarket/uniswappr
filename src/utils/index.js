import { Token } from '@uniswap/sdk-core'
import { tickToPrice } from '@uniswap/v3-sdk'

const formatNumber = (price) => {
  const priceInt = parseInt(price)
  // const toFixed = priceInt >= 100 ? 0 : priceInt >= 1 ? 3 : 4
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
    return '0 to infinity'
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
  console.log('_token0.symbol', _token0.symbol)  
  console.log('_token1.symbol', _token1.symbol)  
  console.log('priceLower.toSignificant(8)', priceLower.toSignificant(8))  
  console.log('priceUpper.toSignificant(8)', priceUpper.toSignificant(8))  

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

export const showFeeTier = fee => {
  if(fee === 10000) return '1%'
  if(fee === 3000) return '0.3%'
  if(fee === 500) return '0.05%'
  if(fee === 100) return '0.01%'
}

export const showNetworkName = chainId => {
  if(chainId === 1)return 'Ethereum'
  if(chainId === 10)return 'Optimism'
  if(chainId === 137)return 'Polygon'
  if(chainId === 42161)return 'Arbitrum'
}