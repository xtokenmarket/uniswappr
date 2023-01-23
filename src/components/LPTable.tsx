import React from 'react'
import { Table } from 'flowbite-react'

const { Body, Cell, Head, HeadCell, Row } = Table

type LPTableParam = {
  positions: any[]
}

const lpData = [
  {
    id: 1,
    token0: { amount: 135.77, symbol: 'USDC' },
    token1: { amount: 1.25, symbol: 'WETH' },
  },
  {
    id: 2,
    token0: { amount: 115, symbol: 'USDT' },
    token1: { amount: 155.25, symbol: 'DAI' },
  },
  {
    id: 3,
    token0: { amount: 55.6, symbol: 'XTK' },
    token1: { amount: 0.75, symbol: 'WETH' },
  },
]

const TableHeader = () => {
  return (
    <Head>
      <HeadCell>ID</HeadCell>
      <HeadCell>Token</HeadCell>
      <HeadCell>Amount</HeadCell>
      <HeadCell>Token</HeadCell>
      <HeadCell>Amount</HeadCell>
    </Head>
  )
}

// const tableRows = lpData.map((data) => (
const tableRow = (position: any) => {
  console.log('tablerowposition', position)
  return (
    <Row
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
      key={position.positionId}
    >
      <Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {position.positionId}
      </Cell>
      <Cell>{position.token0.symbol}</Cell>
      <Cell>{position.token0.stakedAmount}</Cell>
      <Cell>{position.token1.symbol}</Cell>
      <Cell>{position.token1.stakedAmount}</Cell>
    </Row>
  )
} 

const LPTable = ({ positions }: LPTableParam) => {
  console.log('positions', positions)
  return (
    <Table hoverable={true}>
      <TableHeader />
      <Body className="divide-y">{positions.map(p => tableRow(p))}</Body>
    </Table>
  )
}

export default LPTable
