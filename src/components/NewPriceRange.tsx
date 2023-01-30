import React, { useState } from 'react'
import { Card, Label, Table, TextInput, Spinner } from 'flowbite-react'
import Button, { EButtonVariant } from './Button'
import { tryParseTick } from '../utils/parse'

// const NewPriceRange = ({ lowPrice, highPrice, poolData }: any) => {
function NewPriceRange({ lowPrice, highPrice, poolData }: any) {
  //   const [leftPrice, setLeftPrice] = useState()
  //   const [rightPrice, setRightPrice] = useState()

  const [state, setState] = useState({
    leftPrice: '',
    rightPrice: '',
  })

  const leftPriceInputChange = (e: any) => {
    // e.preventDefault()
    // console.log('e', e.target.value)
    // setLeftPrice(e.target.value)
    setState((prev) => ({
        ...prev,
        leftPrice: e.target.value
    }))
  }

  const rightPriceInputChange = (e: any) => {
    // e.preventDefault()
    console.log('e', e.target.value)
    setState((prev) => ({
      ...prev,
      rightPrice: e.target.value,
    }))
    // setRightPrice(e.target.value)
  }

  const onBlurLeft = () => {
    console.log('poolData', poolData)
    const parseTick = tryParseTick(
      poolData.token0,
      poolData.token1,
      3000,
      state.leftPrice
    )
    console.log('parseTick', parseTick)
  }

  const onBlurRight = () => {
    const parseTick = tryParseTick(
      poolData.token0,
      poolData.token1,
      3000,
      state.rightPrice
    )
    console.log('parseTick', parseTick)
  }

  return (
    <div className="flex flex-col pt-10">
      <Card href="#">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Input new parameters
        </h5>
        <form className="flex flex-row gap-4 mb-20">
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
              onFocus={(e) => {
                console.log(e)
                console.log(e.isDefaultPrevented())
                console.log(e.isPropagationStopped())
                e.preventDefault()
              }}
              value={state.leftPrice}
              required={true}
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
              value={state.rightPrice}
            />
            <div className="text-xs text-gray-900 whitespace-nowrap dark:text-white mt-2">
              {poolData.token0.symbol} per {poolData.token1.symbol}
            </div>
          </div>
          <div className="flex items-end flex-1">
            <Button className="w-full" type="submit">
              Simulate
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default NewPriceRange
