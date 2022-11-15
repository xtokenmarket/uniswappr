import React from 'react'

const ConnectWalletPage = () => {
  return (
    <div className="flex flex-col h-full px-40 pt-24 bg-white">
      <div className="flex flex-col items-center mx-auto xl:flex-row">
        <div className="w-[560px] h-[406px] bg-orange-300">
          Image placeholder
        </div>
        <div className="flex flex-col flex-1 ml-20 w-fit">
          <span className="text-4xl font-extrabold">
            Reposition your Uniswap Liquidity
          </span>
          <span className="py-6 text-lg text-gray-500">
            One in, one out, simple as that!
          </span>
          <button className="w-fit">placholder button</button>
        </div>
      </div>
    </div>
  )
}

export default ConnectWalletPage
