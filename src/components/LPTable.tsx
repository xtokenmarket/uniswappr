import React from 'react'
import { Table } from 'flowbite-react'

const { Body, Cell, Head, HeadCell, Row } = Table

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

const tableRows = lpData.map((data) => (
  <Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={data.id}>
    <Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
      {data.id}
    </Cell>
    <Cell>{data.token0.symbol}</Cell>
    <Cell>{data.token0.amount}</Cell>
    <Cell>{data.token1.symbol}</Cell>
    <Cell>{data.token1.amount}</Cell>
  </Row>
))

const LPTable = () => {
  return (
    <Table hoverable={true}>
      <TableHeader />
      <Body className="divide-y">{tableRows}</Body>
    </Table>
  )
}

export default LPTable
