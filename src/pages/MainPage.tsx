import React, { useState } from 'react'

import LPTable from '../components/LPTable'
import LPDetails from '../components/LPDetails'

type MainPageParam = {
  positions: any[]
}

const MainPage = ({ positions }: MainPageParam) => {
  const [selected, toggleSelected] = useState<any>(null)
  return (
    <div className="flex flex-col h-full px-12 pt-10">
      <div className="flex flex-col mx-auto xl:flex-column">
        <div className="w-[850px]">
          <p className="text-xl font-extrabold">My LP Positions</p>
          <p className="mt-2 text-gray-500 mb-5">
            Reposition your Uniswap Liquidity
          </p>
          <LPTable positions={positions} toggleSelected={toggleSelected} />
        </div>

        <div className="flex flex-col flex-1 mt-10 w-[850px]">
          {selected != null ? (
            <LPDetails selectedPosition={selected} />
          ) : (
            <>
              <p className="text-xl font-extrabold">Select a position</p>
              <p className="mt-6 text-xl text-gray-500 mb-14">
                Get started by selecting a position.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MainPage
