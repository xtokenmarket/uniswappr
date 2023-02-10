/* eslint-disable */
const { ethers, BigNumber } = require('ethers')
const axios = require('axios')
const { Network, Alchemy } = require('alchemy-sdk')
const { tickToPrice } = require('@uniswap/v3-sdk')
const xtokenPositionManagerAbi = require('../abis/xtokenPositionManager.json')
const uniswapV3PositionManagerAbi = require('../abis/uniswapV3PositionManager.json')
const {
  XTOKEN_POSITION_MANAGER,
  UNISWAP_V3_POSITION_MANAGER,
} = require('./constants')
const { getPriceFromTicksFormatted } = require('../utils')
const { getSwapParams } = require('./getSwapParams')

export const reposition = async (signerOrProvider, repositionParams) => {
  const xtokenPositionManager = new ethers.Contract(
    XTOKEN_POSITION_MANAGER,
    xtokenPositionManagerAbi,
    signerOrProvider
  )
  const uniPositionManager = new ethers.Contract(
    UNISWAP_V3_POSITION_MANAGER,
    uniswapV3PositionManagerAbi,
    signerOrProvider
  )

  let approval = await uniPositionManager.approve(
    XTOKEN_POSITION_MANAGER,
    repositionParams.positionId
  )
  approval = await approval.wait()
  console.log('nft approved')

  let repositionTx = await xtokenPositionManager.reposition(repositionParams)
  repositionTx = await repositionTx.wait()
  return repositionTx
}

export const repositionSim = async (
  signerOrProvider,
  positionData,
  repositionParams
) => {
  /* Simulation */
  const { REACT_APP_ALCHEMY_API_KEY } = process.env
  const alchemySettings = {
    apiKey: REACT_APP_ALCHEMY_API_KEY,
    network: Network.MATIC_MAINNET, // todo: do dynamically
  }

  const alchemy = new Alchemy(alchemySettings)
  const xtokenPositionManager = new ethers.Contract(
    XTOKEN_POSITION_MANAGER,
    xtokenPositionManagerAbi,
    signerOrProvider
  )
  const uniPositionManager = new ethers.Contract(
    UNISWAP_V3_POSITION_MANAGER,
    uniswapV3PositionManagerAbi,
    signerOrProvider
  )

  const unsignedApprovalTx =
    await uniPositionManager.populateTransaction.approve(
      XTOKEN_POSITION_MANAGER,
      repositionParams.positionId
    )

  const approvalTx = {
    from: signerOrProvider._address,
    to: UNISWAP_V3_POSITION_MANAGER,
    value: '0x0',
    data: unsignedApprovalTx.data,
  }

  const { positionId, newTickLower, newTickUpper } = repositionParams
  const { token0, token1 } = positionData
  const token0Decimals = token0.decimals
  const token1Decimals = token1.decimals

  let deposited = await xtokenPositionManager.getStakedTokenBalance(positionId)
  const { tokenToSwap, tokenAmountToSwap } = await getSwapParams(
    signerOrProvider,
    positionId,
    newTickLower,
    newTickUpper
  )

  const fromToken = tokenToSwap === 'token0' ? token0.address : token1.address
  const toToken = tokenToSwap === 'token0' ? token1.address : token0.address
  console.log('tokenToSwap', tokenToSwap)
  console.log('fromToken', fromToken)
  console.log('toToken', toToken)
  console.log('tokenAmountToSwap', tokenAmountToSwap)

  let oneInchData = await getOneInchCalldata(
    xtokenPositionManager.address,
    signerOrProvider.provider._network.chainId,
    tokenAmountToSwap,
    fromToken,
    toToken
  )

  let params = {
    positionId,
    newTickLower,
    newTickUpper,
    minAmount0Staked: 0,
    minAmount1Staked: 0,
    oneInchData,
  }
  console.log(
    'params',
    `{positionId: ${positionId}, newTickLower: ${newTickLower}, newTickUpper: ${newTickUpper}, minAmount0Staked: 0, minAmount1Staked: 0, oneInchData: ${oneInchData}}`
  )
  const unsignedRepositionTx =
    await xtokenPositionManager.populateTransaction.reposition(params)

  const repositionTx = {
    from: signerOrProvider._address,
    to: xtokenPositionManager.address,
    value: '0x0',
    data: unsignedRepositionTx.data,
  }

  const options = {
    method: 'POST', // todo: make dynamic
    url: `https://polygon-mainnet.g.alchemy.com/v2/${REACT_APP_ALCHEMY_API_KEY}`,
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    data: {
      id: 1,
      jsonrpc: '2.0',
      method: 'alchemy_simulateExecutionBundle',
      params: [[approvalTx, repositionTx]],
    },
  }

  const resp = await axios.request(options)
  console.log('resp', resp)
  const logs = resp.data.result[1].logs

  const collectEvents = logs.filter((l) => l.decoded?.eventName == 'Collect')
  const decreaseEvents = logs.filter(
    (l) => l.decoded?.eventName == 'DecreaseLiquidity'
  )
  const swapEvent = logs.filter((l) => l.decoded?.eventName == 'Swap')
  const repositionedEvent = logs.filter(
    (l) => l.decoded?.eventName == 'Repositioned'
  )
  const transferEvents = logs.filter((l) => l.decoded?.eventName == 'Transfer')
  const increaseEvents = logs.filter(
    (l) => l.decoded?.eventName == 'IncreaseLiquidity'
  )
  const mintEvent = logs.filter((l) => l.decoded?.eventName == 'Mint')

  const feeAmountsCollected = getCollectedFeeAmounts(
    collectEvents,
    token0Decimals,
    token1Decimals
  )
  const tokenAmountsRemoved = getRemovedLiquidityAmounts(
    decreaseEvents,
    token0Decimals,
    token1Decimals
  )

  const swapData = getSwapData(swapEvent, token0, token1)

  const newPositionData = getNewPositionData(
    mintEvent,
    token0,
    token1,
    signerOrProvider.provider._network.chainId
  )

  const newStakedAmounts = getNewStakedAmounts(
    mintEvent,
    token0Decimals,
    token1Decimals
  )

  const { token0Text, token1Text } = getTokenRetrievals(
    logs,
    transferEvents,
    token0,
    token1,
    signerOrProvider._address
  )

  const slice = (str) => String(str).slice(0, 7)
  const symbol0 = token0.symbol
  const symbol1 = token1.symbol

  const feesCollect = `Collect ${slice(
    feeAmountsCollected.token0Fees
  )} ${symbol0} + ${slice(feeAmountsCollected.token1Fees)} ${symbol1} in fees`
  const tokensWithdraw = `Withdraw ${slice(
    tokenAmountsRemoved.token0Removed
  )} ${symbol0} + ${slice(
    tokenAmountsRemoved.token1Removed
  )} ${symbol1} in liquidity`
  const mintPosition = `Mint new position with ticks range [${newPositionData.newLowerTick}, ${newPositionData.newUpperTick}]`
  const priceRangePosition = `Tick range equivalent to ${newPositionData.prices}`
  const tokensDeposit = `Deposit ${slice(
    newStakedAmounts.token0Staked
  )} ${symbol0} + ${slice(
    newStakedAmounts.token1Staked
  )} ${symbol1} in new position`

  const projectedActions = [
    feesCollect,
    tokensWithdraw,
    swapData,
    mintPosition,
    priceRangePosition,
    tokensDeposit,
    token0Text,
    token1Text,
  ]

  const unformattedNewStakedAmounts = getNewStakedAmountsUnformatted(mintEvent)

  const fullRepositionParams = {
    positionId: Number(positionId),
    newTickLower: Number(newTickLower),
    newTickUpper: Number(newTickUpper),
    minAmount0Staked: BigNumber.from(unformattedNewStakedAmounts.token0Staked)
      .mul(99)
      .div(100),
    minAmount1Staked: BigNumber.from(unformattedNewStakedAmounts.token1Staked)
      .mul(99)
      .div(100),
    oneInchData,
  }

  return {
    feeAmountsCollected,
    tokenAmountsRemoved,
    swapData,
    newPositionData,
    newStakedAmounts,
    projectedActions,
    repositionParams: fullRepositionParams,
  }
}

export const getOneInchCalldata = async (
  lpSwapperAddress,
  networkId,
  swapAmount,
  fromToken,
  toToken
  //   _0for1
) => {
  //   let networkId = getNetworkId(network)
  //   if (_0for1) {
  let apiUrl = `https://api.1inch.exchange/v4.0/${networkId}/swap?fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${swapAmount}&fromAddress=${lpSwapperAddress}&slippage=50&disableEstimate=true`
  let response = await axios.get(apiUrl)
  let oneInchData = response.data.tx.data
  // //   } else {
  //     let apiUrl = `https://api.1inch.exchange/v4.0/${networkId}/swap?fromTokenAddress=${t1Address}&toTokenAddress=${t0Address}&amount=${swapAmount}&fromAddress=${lpSwapperAddress}&slippage=50&disableEstimate=true`
  //     let response = await axios.get(apiUrl)
  //     oneInchData = response.data.tx.data
  return oneInchData
}
// }

async function getRepositionSwapAmount(
  LPManager, //xtokenpositionmanager
  positionId,
  amount0,
  amount1,
  token0Decimals,
  token1Decimals,
  newTickLower,
  newTickUpper,
  considerPoolLiquidity
) {
  let poolPrice = await LPManager.getPoolPrice(positionId)
  let priceLower = await LPManager.getPriceFromTick(newTickLower)
  let priceUpper = await LPManager.getPriceFromTick(newTickUpper)
  let minted = await getMintedAmounts(
    LPManager,
    amount0,
    amount1,
    poolPrice,
    priceLower,
    priceUpper
  )
  let midPrice = await LPManager.getPoolPriceWithDecimals(
    positionId,
    token0Decimals,
    token1Decimals
  )

  let mintLiquidity = await LPManager[
    'getLiquidityForAmounts(uint256,uint256,uint256)'
  ](minted[0], minted[1], positionId)
  let poolLiquidity = await LPManager.getPoolLiquidity(positionId)
  let liquidityRatio = mintLiquidity.mul(bn(10).pow(18)).div(poolLiquidity)

  // n - swap amt, x - amount 0 to mint, y - amount 1 to mint,
  // z - amount 0 minted, t - amount 1 minted, p0 - pool mid price
  // l - liquidity ratio (current mint liquidity vs total pool liq)
  // (X - n) / (Y + n * p0) = (Z + l * n) / (T - l * n * p0) ->
  // n = (X * T - Y * Z) / (p0 * l * X + p0 * Z + l * Y + T)

  let denominator
  if (considerPoolLiquidity) {
    // with liquidity ratio
    denominator = amount0
      .mul(liquidityRatio)
      .mul(midPrice)
      .div(bn(10).pow(18))
      .div(1e12)
      .add(midPrice.mul(minted[0]).div(1e12))
      .add(liquidityRatio.mul(amount1).div(bn(10).pow(18)))
      .add(minted[1])
  } else {
    // without liquidity ratio
    denominator = amount0
      .mul(midPrice)
      .div(1e12)
      .add(midPrice.mul(minted[0]).div(1e12))
      .add(amount1)
      .add(minted[1])
  }

  let a = amount0.mul(minted[1]).div(denominator)
  let b = amount1.mul(minted[0]).div(denominator)
  let swapAmount = a.gte(b) ? a.sub(b) : b.sub(a).mul(midPrice).div(1e12)
  let swapSign = a.gte(b) ? true : false

  return [swapAmount, swapSign]
}

const getMintedAmounts = async (
  LPManager,
  amount0,
  amount1,
  poolPrice,
  priceLower,
  priceUpper
) => {
  let amountsMinted = await LPManager.calculatePoolMintedAmounts(
    amount0,
    amount1,
    poolPrice,
    priceLower,
    priceUpper
  )
  return [
    amountsMinted.amount0Minted.toString(),
    amountsMinted.amount1Minted.toString(),
  ]
}

function bn(amount) {
  return ethers.BigNumber.from(amount)
}

const getCollectedFeeAmounts = (
  collectEvents,
  token0Decimals,
  token1Decimals
) => {
  const token0FeesCollected = collectEvents[0].decoded.inputs[4].value
  const token1FeesCollected = collectEvents[0].decoded.inputs[5].value
  return {
    token0Fees: Number.parseFloat(
      token0FeesCollected / 10 ** token0Decimals
    ).toFixed(6),
    token1Fees: Number.parseFloat(
      token1FeesCollected / 10 ** token1Decimals
    ).toFixed(6),
  }
}

const getRemovedLiquidityAmounts = (
  decreaseEvents,
  token0Decimals,
  token1Decimals
) => {
  const token0Removed = decreaseEvents[0].decoded.inputs[2].value
  const token1Removed = decreaseEvents[0].decoded.inputs[3].value
  return {
    token0Removed: token0Removed / 10 ** token0Decimals,
    token1Removed: token1Removed / 10 ** token1Decimals,
  }
}

const getNewStakedAmounts = (mintEvent, token0Decimals, token1Decimals) => {
  const { token0Staked, token1Staked } =
    getNewStakedAmountsUnformatted(mintEvent)
  return {
    token0Staked: token0Staked / 10 ** token0Decimals,
    token1Staked: token1Staked / 10 ** token1Decimals,
  }
}

const getNewStakedAmountsUnformatted = (mintEvent) => {
  const inputs = mintEvent[0].decoded.inputs
  return {
    token0Staked: inputs[5].value,
    token1Staked: inputs[6].value,
  }
}

const getNewPositionData = (mintEvent, token0, token1, chainId) => {
  const inputs = mintEvent[0].decoded.inputs
  const newLowerTick = inputs[1].value
  const newUpperTick = inputs[2].value

  const prices = getPriceFromTicksFormatted(
    Number(newLowerTick),
    Number(newUpperTick),
    token0,
    token1,
    chainId
  )

  return {
    newLowerTick,
    newUpperTick,
    prices,
  }
}

const getSwapData = (swapEvent, token0, token1) => {
  console.log('swapEvent', swapEvent)
  if (!swapEvent.length) return `No swaps performed`

  const inputs = swapEvent[0].decoded.inputs

  let tokenOut, tokenIn, tokenOutAmount, tokenInAmount
  if (Number(inputs[2].value) > 0) {
    // token0 swapped out, token1 received in
    tokenOut = token0.symbol
    tokenIn = token1.symbol
    tokenOutAmount = inputs[2].value / 10 ** token0.decimals
    tokenInAmount = inputs[5].value / 10 ** token1.decimals
  } else {
    tokenOut = token1.symbol
    tokenIn = token0.symbol
    tokenOutAmount = inputs[3].value / 10 ** token1.decimals
    tokenInAmount = inputs[4].value / 10 ** token0.decimals
  }

  return `Swap ${String(tokenOutAmount).slice(0, 7)} ${tokenOut} for ${String(
    tokenInAmount
  ).slice(0, 7)} ${tokenIn}`
}

const parseTransfersForSwaps = (transferEvents) => {}

const getTokenRetrievals = (
  allEvents,
  transferEvents,
  token0,
  token1,
  userAddress
) => {
  const retrievedEvents = transferEvents.filter(
    (e) => ethers.utils.getAddress(e.decoded.inputs[1].value) == userAddress
  )
  const token0Retrieval = retrievedEvents.find(
    (e) => ethers.utils.getAddress(e.address) == token0.address
  )

  const token1Retrieval = retrievedEvents.find(
    (e) => ethers.utils.getAddress(e.address) == token1.address
  )

  let token0Retrieved, token1Retrieved

  if (!token0Retrieval) {
    const nonDecodedEvent = allEvents.filter(
      (e) =>
        ethers.utils.getAddress(e.address) === token0.address &&
        userAddress === ethers.utils.getAddress(e.topics[2])
    )
    token0Retrieved = parseInt(nonDecodedEvent[0].data, 16)
  } else {
    token0Retrieved = token0Retrieval.decoded.inputs[2].value
  }

  if (!token1Retrieval) {
    const nonDecodedEvent = allEvents.filter(
      (e) =>
        ethers.utils.getAddress(e.address) === token1.address &&
        userAddress === ethers.utils.getAddress(e.topics[2])
    )
    token1Retrieved = parseInt(nonDecodedEvent[0].data, 16)
  } else {
    token1Retrieved = token1Retrieval.decoded.inputs[2].value
  }

  token0Retrieved = token0Retrieved / 10 ** token0.decimals
  token1Retrieved = token1Retrieved / 10 ** token1.decimals

  const token0Text = `${token0Retrieved.toFixed(6)} ${token0.symbol}`
  const token1Text = `${token1Retrieved.toFixed(6)} ${token1.symbol}`

  return {
    token0Text: `Return ${token0Text} to user`,
    token1Text: `Return ${token1Text} to user`,
  }
}

export const getTxDataForReposition = async (
  signerOrProvider,
  repositionParams,
  positionData,
  xtokenPositionManager
) => {
  const { positionId, newTickLower, newTickUpper } = repositionParams
  const { token0, token1 } = positionData
  const token0Decimals = token0.decimals
  const token1Decimals = token1.decimals
  let deposited = await xtokenPositionManager.getStakedTokenBalance(positionId)
  let [swapAmt, side] = await getRepositionSwapAmount(
    xtokenPositionManager,
    positionId,
    deposited.amount0,
    deposited.amount1,
    token0Decimals,
    token1Decimals,
    repositionParams.newTickLower,
    repositionParams.newTickUpper,
    true
    // false
  )
  let oneInchData = await getOneInchCalldata(
    xtokenPositionManager.address,
    signerOrProvider.provider._network.chainId,
    swapAmt,
    token0.address,
    token1.address,
    side
  )

  let params = {
    positionId,
    newTickLower,
    newTickUpper,
    minAmount0Staked: 0,
    minAmount1Staked: 0,
    oneInchData,
  }
  const unsignedRepositionTx =
    await xtokenPositionManager.populateTransaction.reposition(params)
  return unsignedRepositionTx.data
}
