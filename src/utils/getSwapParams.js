/* eslint-disable */
const { ethers } = require('ethers')
const Quoter = require('@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json')
const ERC20 = require('../abis/erc20.json')
const xtokenPositionManagerAbi = require('../abis/xtokenPositionManager.json')
const { XTOKEN_POSITION_MANAGER } = require('./constants')

export const getSwapParams = async (
  signerOrProvider,
  currentPositionId,
  newTickLower,
  newTickUpper,
  poolFee,
  collectableFees
) => {
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

  const poolPrice = await xtokenPositionManager.getPoolPrice(currentPositionId)
  // exchanging 1 token0 for ? token1
  const quote = await getQuote(
    signerOrProvider,
    token0.address,
    token1.address,
    poolFee,
    String(10 ** token0Decimals)
  )
  console.log('quote', quote.toString())

  const currentDeposited = await xtokenPositionManager.getStakedTokenBalance(
    currentPositionId
  )
  console.log('currentDeposited[0]', currentDeposited[0].toString())
  console.log('currentDeposited[1]', currentDeposited[1].toString())

  /* 
   Current Situation
  */
  console.log('*****current situation***')
  const currentToken0Deposits = bn(currentDeposited.amount0).add(
    bn(collectableFees.amount0)
  )

  // token0 valueDeposited in token1 terms
  const valueDepositedToken0 = bn(currentToken0Deposits)
    .mul(bn(quote))
    .div(bn(10).pow(token0Decimals))
  console.log('valueDepositedToken0', valueDepositedToken0.toString())

  const valueDepositedToken1 = currentDeposited.amount1.add(
    collectableFees.amount1
  )
  console.log('valueDepositedToken1', valueDepositedToken1.toString())
  const totalValueInToken1Terms = valueDepositedToken0.add(
    bn(valueDepositedToken1)
  )
  console.log('totalValueInToken1Terms', totalValueInToken1Terms.toString())
  const currentToken0ValueShare =
    Number(valueDepositedToken0) / Number(totalValueInToken1Terms)

  console.log('currentToken0ValueShare', currentToken0ValueShare.toString())

  console.log('*****')
  /* 
   Target Situation
  */
  console.log('*****target situation***')
  const lowerPrice = await xtokenPositionManager.getPriceFromTick(newTickLower)
  const higherPrice = await xtokenPositionManager.getPriceFromTick(newTickUpper)
  const pseudoDepositedTarget =
    await xtokenPositionManager.calculatePoolMintedAmounts(
      String(10 ** token0Decimals),
      String(10 ** token1Decimals),
      poolPrice,
      lowerPrice,
      higherPrice
    )
  console.log(
    'pseudoDepositedTarget amount0minted',
    pseudoDepositedTarget.amount0Minted.toString()
  )
  console.log(
    'pseudoDepositedTarget amount1minted',
    pseudoDepositedTarget.amount1Minted.toString()
  )
  // value in token1 terms
  const pseudoValueDepositedToken0 = bn(pseudoDepositedTarget.amount0Minted)
    .mul(bn(quote))
    .div(bn(10).pow(token0Decimals))

  console.log(
    'pseudoValueDepositedToken0',
    pseudoValueDepositedToken0.toString()
  )
  const pseudoValueDepositedToken1 = pseudoDepositedTarget.amount1Minted
  console.log(
    'pseudoValueDepositedToken1',
    pseudoValueDepositedToken1.toString()
  )
  const pseuooTotalValueInToken1Terms = pseudoValueDepositedToken0.add(
    bn(pseudoValueDepositedToken1)
    )
  console.log(
    'pseuooTotalValueInToken1Terms',
    pseuooTotalValueInToken1Terms.toString()
  )
  const targetToken0ValueShare =
    Number(pseudoValueDepositedToken0) / Number(pseuooTotalValueInToken1Terms)
  console.log('targetToken0ValueShare', targetToken0ValueShare.toString())  

  let tokenToSwap, tokenAmountToSwap
  if (targetToken0ValueShare == 0) {
    tokenToSwap = 'token0'
    tokenAmountToSwap = currentDeposited.amount0
  } else if (targetToken0ValueShare == 100) {
    tokenToSwap = 'token1'
    tokenAmountToSwap = currentDeposited.amount1
  } else if (targetToken0ValueShare > currentToken0ValueShare) {
    // swap token1 for more token0
    tokenToSwap = 'token1'
    tokenAmountToSwap = Math.trunc(
      (targetToken0ValueShare - currentToken0ValueShare) *
        Number(currentDeposited.amount1)
    )
  } else {
    tokenAmountToSwap = Math.trunc(
      (currentToken0ValueShare - targetToken0ValueShare) *
        Number(currentDeposited.amount0)
    )
    tokenToSwap = 'token0'
  }

  return {
    tokenAmountToSwap,
    tokenToSwap,
  }
}

function bn(amount) {
  return ethers.BigNumber.from(amount)
}
//
async function getQuote(
  signerOrProvider,
  tokenSwappedOut,
  tokenReceivedIn,
  poolFee,
  swapAmount
) {
  const quoterContract = new ethers.Contract(
    '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6', // quoter contract
    Quoter.abi,
    signerOrProvider
  )

  const quotedAmountIn = await quoterContract.callStatic.quoteExactInputSingle(
    tokenSwappedOut,
    tokenReceivedIn,
    poolFee,
    swapAmount,
    0
  )

  return quotedAmountIn
}
