import React from 'react'
import { Table } from 'flowbite-react'
import { showFeeTier } from '../utils'

const { Body, Cell, Head, HeadCell, Row } = Table

const TableHeader = () => {
  return (
    <Head>
      <HeadCell>ID</HeadCell>
      <HeadCell>Token 0</HeadCell>
      <HeadCell>Amount 0</HeadCell>
      <HeadCell>Token 1</HeadCell>
      <HeadCell>Amount 1</HeadCell>
      <HeadCell>Fee Tier</HeadCell>
      <HeadCell>In Range</HeadCell>
    </Head>
  )
}

const TableRow = ({ position, select, selected }: any) => {
  const {
    positionId,
    token0,
    token1,
    poolData,
    poolData: { positionInRange },
  } = position
  return (
    <Row
      className={`bg-white bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer`}
      onClick={select}
    >
      <Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {positionId}
      </Cell>
      <Cell>{token0.symbol}</Cell>
      <Cell>{token0.stakedAmount.slice(0, 7)}</Cell>
      <Cell>{token1.symbol}</Cell>
      <Cell>{token1.stakedAmount.slice(0, 7)}</Cell>
      <Cell>{showFeeTier(poolData.poolFee)}</Cell>
      <Cell className={positionInRange ? `text-green-500` : `text-red-500`}>
        {positionInRange ? 'Yes' : 'No'}
      </Cell>
    </Row>
  )
}

const LPTable = ({ positions, select, selectedIdx }: any) => {
  return (
    <Table hoverable={true}>
      <TableHeader />
      <Body className="divide-y">
        {positions.map((p: any, i: any) => {
          return (
            <TableRow
              position={p}
              select={() => select(i)}
              selected={selectedIdx === i}
              key={i}
            />
          )
        })}
      </Body>
    </Table>
  )
}

export default LPTable
