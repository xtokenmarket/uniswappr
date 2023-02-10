import React, { useState } from 'react'
import { useSigner } from 'wagmi'
import { Card, Label, Table, TextInput, Spinner } from 'flowbite-react'
import Button, { EButtonVariant } from '../Button'
import { tryParseTick } from '../../utils/parse'
import { repositionSim } from '../../utils/submit'
import { getSwapParams } from '../../utils/getSwapParams'

function NewPriceRange({
  poolData,
  setProjectedActions,
  toggleSimRunning,
  setRepositionParams,
}: any) {
  const { data: signer } = useSigner()

  const [state, setState] = useState({
    leftPrice: '',
    rightPrice: '',
    leftTick: '',
    rightTick: '',
  })

  const leftPriceInputChange = (e: any) => {
    setState((prev: any) => ({
      ...prev,
      leftPrice: e.target.value,
    }))
  }

  const rightPriceInputChange = (e: any) => {
    setState((prev: any) => ({
      ...prev,
      rightPrice: e.target.value,
    }))
  }

  const onBlurLeft = () => {
    const parseTick = tryParseTick(
      poolData.token0,
      poolData.token1,
      poolData.poolFee,
      state.leftPrice
    )
    setState((prev: any) => ({
      ...prev,
      leftTick: parseTick,
    }))
  }

  const onBlurRight = () => {
    const parseTick = tryParseTick(
      poolData.token0,
      poolData.token1,
      poolData.poolFee,
      state.rightPrice
    )
    setState((prev: any) => ({
      ...prev,
      rightTick: parseTick,
    }))
  }

  const runRepositionSim = async (e: any) => {
    e.preventDefault()
    toggleSimRunning(true)
    const { projectedActions, repositionParams } = await repositionSim(
      signer,
      poolData,
      {
        positionId: poolData.nftId,
        newTickLower: state.leftTick,
        newTickUpper: state.rightTick,
      }
    )
    setProjectedActions(projectedActions)
    setRepositionParams(repositionParams)
    toggleSimRunning(false)
  }

  const outOfRange = !poolData.positionInRange

  return (
    <div className="flex flex-col pt-10">
      <Card>
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Input new parameters
        </h5>
        <form className="flex flex-row gap-4 mb-6" onSubmit={runRepositionSim}>
          <div>
            <div className="block mb-2">
              <Label htmlFor="lowPrice" value="Low Price" />
            </div>
            <TextInput
              id="lowPrice"
              type="text"
              inputMode="numeric"
              placeholder=""
              onChange={leftPriceInputChange}
              onBlur={onBlurLeft}
              value={state.leftPrice}
              required={true}
              disabled={outOfRange ? true : false}
            />
            <div className="text-xs text-gray-900 whitespace-nowrap dark:text-white mt-2">
              {poolData.token0.symbol} per {poolData.token1.symbol}
            </div>
          </div>
          <div>
            <div className="block mb-2">
              <Label htmlFor="highPrice" value="High Price" />
            </div>
            <TextInput
              id="highPrice"
              type="text"
              inputMode="numeric"
              placeholder=""
              onChange={rightPriceInputChange}
              onBlur={onBlurRight}
              disabled={outOfRange ? true : false}
            />
            <div className="text-xs text-gray-900 whitespace-nowrap dark:text-white mt-2">
              {poolData.token0.symbol} per {poolData.token1.symbol}
            </div>
          </div>
          <div className="flex items-end flex-1 mb-6 cursor-pointer">
            <Button
              className="w-full"
              type="submit"
              disabled={outOfRange ? true : false}
            >
              {outOfRange ? 'Out of Range Unsupported' : 'Simulate'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default NewPriceRange
