/* eslint-disable */
import { useContract } from 'wagmi'
import { useState, useEffect } from 'react'
import { ethers, BigNumber } from 'ethers'
import { Token } from '@uniswap/sdk-core'
import uniswapV3PositionManagerAbi from '../abis/uniswapV3PositionManager.json'
import xtokenPositionManagerAbi from '../abis/xtokenPositionManager.json'
import erc20Abi from '../abis/erc20.json'
import { getPriceRange } from '../utils'
const {
  UNISWAP_V3_POSITION_MANAGER,
  XTOKEN_POSITION_MANAGER,
  SUPPORTED_NETWORK_IDS,
} = require('../utils/constants')

export function usePositions(signerOrProvider: any) {
  const [positions, setPositions] = useState<any[]>()

  const xtokenPositionManager = useContract({
    address: XTOKEN_POSITION_MANAGER,
    abi: xtokenPositionManagerAbi,
    signerOrProvider,
  })

  useEffect(() => {
    async function fetchPositions() {
      if (signerOrProvider && xtokenPositionManager) {
        const uniPositionManager = new ethers.Contract(
          UNISWAP_V3_POSITION_MANAGER,
          uniswapV3PositionManagerAbi,
          signerOrProvider
        )
        const positionQty = await uniPositionManager.balanceOf(
          signerOrProvider._address
        )

        const positionIds = []
        const positions = []

        for (let i = 0; i < Number(positionQty); i++) {
          try {
            const positionId = await uniPositionManager.tokenOfOwnerByIndex(
              signerOrProvider._address,
              i
            )
            positionIds.push(String(positionId))
          } catch (e) {
            console.log(e)
          }
        }

        for (let i = 0; i < positionIds.length; i++) {
          try {
            const position = await uniPositionManager.positions(positionIds[i])
            const token0 = position['token0']
            const token1 = position['token1']

            const token0Contract = new ethers.Contract(
              token0,
              erc20Abi,
              signerOrProvider
            )
            const token1Contract = new ethers.Contract(
              token1,
              erc20Abi,
              signerOrProvider
            )

            const token0Details = await getTokenDetails(token0Contract)
            const token1Details = await getTokenDetails(token1Contract)

            const stakedAmounts =
              await xtokenPositionManager.getStakedTokenBalance(positionIds[i])
            const stakedAmount0 = ethers.utils.formatUnits(
              stakedAmounts[0],
              token0Details.decimals
            )
            const stakedAmount1 = ethers.utils.formatUnits(
              stakedAmounts[1],
              token1Details.decimals
            )

            // if true, position has been previously closed
            if (stakedAmount0 == '0.0' && stakedAmount1 == '0.0') {
              continue
            }

            let positionInRange = true
            if (stakedAmount0 == '0.0' || stakedAmount1 == '0.0') {
              positionInRange = false
            }
            const tickLower = position['tickLower']
            const tickUpper = position['tickUpper']

            const chainId = await signerOrProvider.provider._network.chainId
            const Token0 = new Token(
              chainId,
              token0,
              token0Details.decimals,
              token0Details.symbol,
              token0Details.symbol
            )
            const Token1 = new Token(
              chainId,
              token1,
              token1Details.decimals,
              token1Details.symbol,
              token1Details.symbol
            )

            const poolData = {
              token0: Token0,
              token1: Token1,
              token0Staked: stakedAmounts[0],
              token1Staked: stakedAmounts[1],
              ticks: {
                tick0: tickLower,
                tick1: tickUpper,
              },
              poolFee: position.fee,
              chainId,
              nftId: positionIds[i],
              positionInRange,
            }

            const priceRange = getPriceRange(poolData)
            const isZeroInf = priceRange === '0 to INF' ? true : false
            const split = priceRange.split(' ')
            const lowPrice = isZeroInf ? '0' : Number(split[0])
            const highPrice = isZeroInf ? '∞' : Number(split[5])
            const inverseLowPrice = isZeroInf ? '0' : 1 / Number(highPrice)
            const inverseHighPrice = isZeroInf ? '∞' : 1 / Number(lowPrice)

            const priceRangeText = `${token1Details.symbol} per ${token0Details.symbol}`
            const inversePriceRangeText = `${token0Details.symbol} per ${token1Details.symbol}`

            const positionDetails = {
              token0: {
                symbol: token0Details.symbol,
                decimals: token0Details.decimals,
                stakedAmount: stakedAmount0,
              },
              token1: {
                symbol: token1Details.symbol,
                decimals: token1Details.decimals,
                stakedAmount: stakedAmount1,
              },
              tickLower,
              tickUpper,
              positionId: positionIds[i],
              lowPrice,
              highPrice,
              inverseLowPrice,
              inverseHighPrice,
              priceRangeText,
              inversePriceRangeText,
              poolData,
            }

            positions.push(positionDetails)
          } catch (e) {
            console.log(e)
          }
        }

        setPositions(positions)
      }
    }
    fetchPositions()
  }, [signerOrProvider])

  return [positions]
}

const getTokenDetails = async (tokenContract: any) => {
  const symbol = await tokenContract.symbol()
  const decimals = await tokenContract.decimals()
  return {
    symbol,
    decimals,
  }
}
