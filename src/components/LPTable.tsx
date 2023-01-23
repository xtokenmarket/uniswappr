import React from 'react'
import { Table } from 'flowbite-react'

const { Body, Cell, Head, HeadCell, Row } = Table

type LPTableParam = {
  positions: any[],
  toggleSelected: any
}

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

const tableRow = (position: any, toggleSelected: any) => {
  const { positionId, token0, token1 } = position
  return (
    <Row
      className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
      key={positionId}
      onClick={() => toggleSelected(position)}
    >
      <Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {positionId}
      </Cell>
      <Cell>{token0.symbol}</Cell>
      <Cell>{token0.stakedAmount}</Cell>
      <Cell>{token1.symbol}</Cell>
      <Cell>{token1.stakedAmount}</Cell>
    </Row>
  )
} 

const LPTable = ({ positions, toggleSelected }: LPTableParam) => {
  return (
    <Table hoverable={true}>
      <TableHeader />
      <Body className="divide-y">{positions.map(p => tableRow(p, toggleSelected))}</Body>
    </Table>
  )
}

export default LPTable
