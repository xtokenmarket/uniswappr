/* eslint-disable */
const { ethers, BigNumber } = require('ethers')
const ERC20 = require('../abis/erc20.json')
const xtokenPositionManagerAbi = require('../abis/xtokenPositionManager.json')
const uniswapV3PositionManagerAbi = require('../abis/uniswapV3PositionManager.json')
const {
  XTOKEN_POSITION_MANAGER,
  UNISWAP_V3_POSITION_MANAGER,
} = require('./constants')

export const getSwapParams = async (signerOrProvider, currentPositionId, newTickLower, newTickUpper) => {
  const xtokenPositionManager = new ethers.Contract(
    XTOKEN_POSITION_MANAGER,
    xtokenPositionManagerAbi,
    signerOrProvider
  )
  const tokens = await xtokenPositionManager.getTokens(currentPositionId)
  let token0 = tokens.token0
  let token1 = tokens.token1
  token0 = new ethers.Contract(token0, ERC20, signerOrProvider)
  token1 = new ethers.Contract(token1, ERC20, signerOrProvider)

  const token0Decimals = await token0.decimals.call()
  const token1Decimals = await token1.decimals.call()

//   const newTickLower = '128080'
//   const newTickUpper = '328080'

  const currentPoolPrice = await xtokenPositionManager.getPoolPrice(
    currentPositionId
  )
  const currentDeposited = await xtokenPositionManager.getStakedTokenBalance(
    currentPositionId
  )
  console.log(
    'currentDeposited.amount0Minted',
    currentDeposited.amount0.toString()
  )
  console.log(
    'currentDeposited.amount1Minted',
    currentDeposited.amount1.toString()
  )
  const newRatioDetails = await getNewPositionRatioDetails(
    xtokenPositionManager,
    currentPoolPrice,
    newTickLower,
    newTickUpper,
    currentDeposited,
    token0Decimals,
    token1Decimals
  )

  const res = await getAmountAndTokenToSwap(
    newRatioDetails,
    currentDeposited,
    token0Decimals,
    token1Decimals
  )
  return res
}

async function getAmountAndTokenToSwap(
  newRatioDetails,
  currentDeposited,
  token0Decimals,
  token1Decimals
) {
  const [currentDeposited0Normalized, currentDeposited1Normalized] =
    getNormalizedAmounts(
      [currentDeposited.amount0, currentDeposited.amount1],
      [token0Decimals, token1Decimals]
    )
  console.log(
    'currentDeposited0Normalized',
    currentDeposited0Normalized.toString()
  )
  console.log(
    'currentDeposited1Normalized',
    currentDeposited1Normalized.toString()
  )

  const { largerAmount, targetRatio } = newRatioDetails

  let tokenToSwap, tokenAmountToSwap
  if (largerAmount == 0) {
    // token0Normalized > token1Normalized
    const currentRatio = currentDeposited0Normalized.div(
      currentDeposited1Normalized
    )
    console.log('****')
    console.log('currentRatio', currentRatio.toString())
    console.log('targetRatio', targetRatio.toString())

    if (currentRatio.gt(targetRatio)) {
      //
    } else {
      // need more token0
      // swap token1 for token0
      tokenToSwap = 'token1'
      tokenAmountToSwap = targetRatio
        .sub(currentRatio)
        .mul(currentDeposited1Normalized)
        .div(targetRatio)
        .div(2)
      console.log('tokenAmountToSwap', tokenAmountToSwap.toString())
      
      // denormalize
      tokenAmountToSwap = tokenAmountToSwap.mul(BigNumber.from(10).pow(token1Decimals)).div(BigNumber.from(10).pow(18))
      console.log('tokenAmountToSwap', tokenAmountToSwap.toString())
    }
  } else {
    // todo
  }

  return {
    tokenToSwap,
    tokenAmountToSwap,
  }
}

function getNormalizedAmounts(tokenAmounts, tokenDecimals) {
  const token0AmountNormalized = tokenAmounts[0]
    .mul(BigNumber.from(10).pow(18))
    .div(BigNumber.from(10).pow(tokenDecimals[0]))
  const token1AmountNormalized = tokenAmounts[1]
    .mul(BigNumber.from(10).pow(18))
    .div(BigNumber.from(10).pow(tokenDecimals[1]))
  return [token0AmountNormalized, token1AmountNormalized]
}

async function getNewPositionRatioDetails(
  positionManager,
  poolPrice,
  newTickLower,
  newTickUpper,
  currentDeposited,
  token0Decimals,
  token1Decimals
) {
  const lowerPrice = await positionManager.getPriceFromTick(newTickLower)
  const higherPrice = await positionManager.getPriceFromTick(newTickUpper)

  const pseudoMintedAmounts = await positionManager.calculatePoolMintedAmounts(
    currentDeposited.amount0,
    currentDeposited.amount1,
    poolPrice,
    lowerPrice,
    higherPrice
  )
  console.log(
    'pseudoMintedAmounts.amount0Minted',
    pseudoMintedAmounts.amount0Minted.toString()
  )
  console.log(
    'pseudoMintedAmounts.amount1Minted',
    pseudoMintedAmounts.amount1Minted.toString()
  )
  const [pseudoToken0StakedNormalized, pseudoToken1StakedNormalized] =
    getNormalizedAmounts(
      [pseudoMintedAmounts.amount0Minted, pseudoMintedAmounts.amount1Minted],
      [token0Decimals, token1Decimals]
    )
  console.log(
    'pseudoToken0StakedNormalized',
    pseudoToken0StakedNormalized.toString()
  )
  console.log(
    'pseudoToken1StakedNormalized',
    pseudoToken1StakedNormalized.toString()
  )

  let largerAmount = 0
  let targetRatio
  if (pseudoToken0StakedNormalized.eq(0)) {
    // todo
  } else if (pseudoToken1StakedNormalized.eq(0)) {
    // todo
  } else if (pseudoToken0StakedNormalized.gt(pseudoToken1StakedNormalized)) {
    targetRatio = pseudoToken0StakedNormalized.div(pseudoToken1StakedNormalized)
  } else {
    targetRatio = pseudoToken1StakedNormalized.div(pseudoToken0StakedNormalized)
    largerAmount = 1
  }

  return {
    largerAmount,
    targetRatio,
  }
}
