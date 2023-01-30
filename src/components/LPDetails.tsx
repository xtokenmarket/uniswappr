import React from 'react'
import { Card, Label, Table, TextInput, Spinner } from 'flowbite-react'
import Button, { EButtonVariant } from './Button'
// import ProjectedActions from './ProjectedActions'
import NewPriceRange from './NewPriceRange'

const { Cell, Row } = Table

function LPDetails({ selectedPosition }: any) {
// const LPDetails = ({ selectedPosition }: any) => {
  const {
    positionId,
    token0,
    token1,
    tickLower,
    tickUpper,
    lowPrice,
    highPrice,
    priceRangeText,
    poolData
  } = selectedPosition

  return (
    <div className="flex flex-col w-full h-full pt-10">
      <p className="text-xl font-extrabold">Position ID: {positionId}</p>
      <div className="flex flex-col items-center mx-auto mt-2">
        <Table hoverable={false}>
          <tbody>
            <Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Cell>{token0.symbol} Staked</Cell>
              <Cell>{token1.symbol} Staked</Cell>
              <Cell>Lower Tick</Cell>
              <Cell>Upper Tick</Cell>
              <Cell>{priceRangeText}</Cell>
              <Cell>{priceRangeText}</Cell>
            </Row>
            <Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {token0.stakedAmount.slice(0, 7)}
              </Cell>
              <Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {token1.stakedAmount.slice(0, 7)}
              </Cell>
              <Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {tickLower}
              </Cell>
              <Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {tickUpper}
              </Cell>
              <Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {lowPrice}
                {/* {lowPrice.slice(0, 7)} */}
              </Cell>
              <Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {highPrice}
                {/* {highPrice.slice(0, 7)} */}
              </Cell>
            </Row>
          </tbody>
        </Table>
      </div>
      <NewPriceRange lowPrice={lowPrice} highPrice={highPrice} poolData={poolData} />
    </div>
  )
}

export default LPDetails
