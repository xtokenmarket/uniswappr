import React from 'react'
import { Card, Label, Table, TextInput, Spinner } from 'flowbite-react'
import Button, { EButtonVariant } from './Button'

const { Cell, Row } = Table

const CheckIcon = () => {
  return (
    <svg
      className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}

const LPDetails = ({ selectedPosition }: any) => {
  const { positionId, token0, token1, tickLower, tickUpper } = selectedPosition
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
              <Cell>Lower Price</Cell>
              <Cell>Upper Price</Cell>
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
                0.36
              </Cell>
              <Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                55.6
              </Cell>
            </Row>
          </tbody>
        </Table>
      </div>

      <div className="flex flex-col pt-10">
        <Card href="#">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Input new parameters
          </h5>
          <form className="flex flex-row gap-4">
            <div>
              <div className="block mb-2">
                <Label htmlFor="lowPrice" value="Low Price" />
              </div>
              <TextInput
                id="lowPrice"
                type="number"
                placeholder="0.00"
                required={true}
              />
            </div>
            <div>
              <div className="block mb-2">
                <Label htmlFor="highPrice" value="High Price" />
              </div>
              <TextInput
                id="highPrice"
                type="number"
                placeholder="0.00"
                required={true}
              />
            </div>
            <div className="flex items-end flex-1">
              <Button className="w-full" type="submit">
                Simulate
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <div className="flex flex-col pt-10">
        <Card href="#">
          {/*<div className="text-center">*/}
          {/*  <Spinner size="xl" aria-label="Simulating..." />*/}
          {/*</div>*/}
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Projected actions
          </h5>
          <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
            <li className="flex items-center">
              <CheckIcon />
              <p className="text-gray-900 dark:text-gray-300">
                Remove{' '}
                <strong className="font-semibold dark:text-white">
                  55 USDC
                </strong>{' '}
                and{' '}
                <strong className="font-semibold dark:text-white">
                  1.25 WETH
                </strong>{' '}
                from current position.
              </p>
            </li>
            <li className="flex items-center">
              <CheckIcon />
              <p className="text-gray-900 dark:text-gray-300">
                Remove{' '}
                <strong className="font-semibold dark:text-white">
                  55 USDC
                </strong>{' '}
                and{' '}
                <strong className="font-semibold dark:text-white">
                  1.25 WETH
                </strong>{' '}
                from current position.
              </p>
            </li>
            <li className="flex items-center">
              <CheckIcon />
              <p className="text-gray-900 dark:text-gray-300">
                Remove{' '}
                <strong className="font-semibold dark:text-white">
                  55 USDC
                </strong>{' '}
                and{' '}
                <strong className="font-semibold dark:text-white">
                  1.25 WETH
                </strong>{' '}
                from current position.
              </p>
            </li>
          </ul>
          <div className="flex flex-wrap">
            <div className="w-[62%] mr-[3%]">
              <Button className="w-[100%]">Reposition</Button>
            </div>
            <div className="w-[35%]">
              <Button variant={EButtonVariant.secondary} className={'w-[100%]'}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LPDetails
