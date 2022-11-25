import React from 'react'

import LPTable from '../components/LPTable'
import LPDetails from '../components/LPDetails'

const ConnectWalletPage = () => (
  <div className="flex flex-col h-full px-12 pt-10">
    <div className="flex flex-col mx-auto xl:flex-row">
      <div className="w-[736px] h-[531px]">
        <p className="text-xl font-extrabold">My LP Positions</p>
        <p className="mt-2 text-gray-500 mb-5">
          Reposition your Uniswap Liquidity
        </p>
        <LPTable />
      </div>

      <div className="flex flex-col ml-20 w-[640px] flex-1">
        {/*<p className="text-4xl font-extrabold">Select a position</p>*/}
        {/*<p className="mt-6 text-xl text-gray-500 mb-14">*/}
        {/*  Get started by selecting a position.*/}
        {/*</p>*/}
        {/*<button className="w-fit">placeholder button</button>*/}
        <LPDetails />
      </div>
    </div>
  </div>
)

export default ConnectWalletPage
