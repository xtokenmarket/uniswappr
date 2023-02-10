import React, { useState } from 'react'
import { Table } from 'flowbite-react'

const { Cell, Row } = Table

function PositionTable({ selectedPosition }: any) {
  const {
    token0,
    token1,
    tickLower,
    tickUpper,
    lowPrice,
    highPrice,
    priceRangeText,
  } = selectedPosition
  return (
    <div className="flex flex-col mt-2">
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
              {String(lowPrice).slice(0, 7)}
            </Cell>
            <Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {String(highPrice).slice(0, 7)}
            </Cell>
          </Row>
        </tbody>
      </Table>
    </div>
  )
}

export default PositionTable
