import { useContract } from 'wagmi'
import { useState, useEffect } from 'react'
import { ethers, BigNumber } from 'ethers'
import uniswapV3PositionManagerAbi from '../abis/uniswapV3PositionManager.json'
import xtokenPositionManagerAbi from '../abis/xtokenPositionManager.json'
import erc20Abi from '../abis/erc20.json'

const UNISWAP_V3_POSITION_MANAGER = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'
const XTOKEN_POSITION_MANAGER = '0xdce16ad5cfba50203766f270d69115c265d2687d' // polygon

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
        const uniPositionManager = await new ethers.Contract(
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
          const positionId = await uniPositionManager.tokenOfOwnerByIndex(
            signerOrProvider._address,
            i
          )
          positionIds.push(String(positionId))
        }

        for (let i = 0; i < positionIds.length; i++) {
          const position = await uniPositionManager.positions(positionIds[i])
          console.log('position', position)
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
          const tickLower = position['tickLower']  
          const tickUpper = position['tickUpper']  

          const stakedAmount0 = ethers.utils.formatUnits(
            stakedAmounts[0],
            token0Details.decimals
          )
          const stakedAmount1 = ethers.utils.formatUnits(
            stakedAmounts[1],
            token1Details.decimals
          )

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
          }

          positions.push(positionDetails)
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
