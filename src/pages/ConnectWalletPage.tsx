import React from 'react'
import { useAccount } from 'wagmi'
import Button from '../components/Button'
import useWalletConnector from '../hooks/useWalletConnector'

const ConnectWalletPage = () => {
  const { isConnected } = useAccount()
  const { connect } = useWalletConnector()

  if (isConnected) {
    return <></>
  }

  return (
    <div className="flex flex-col h-full px-40 pt-24 bg-white">
      <div className="flex flex-col items-center mx-auto xl:flex-row">
        <img alt="demo" src="/assets/main-img.png" />

        <div className="flex flex-col flex-1 ml-20 w-fit">
          <p className="text-4xl font-extrabold">
            Reposition your Uniswap Liquidity
          </p>
          <p className="py-6 text-lg text-gray-500">
            One in, one out, simple as that!
          </p>
          <Button
            className="w-fit py-2.5 px-5 flex items-center"
            onClick={() => connect()}
          >
            <span className="mr-2.5">Connect Wallet</span>
            <img alt="logo" src="/assets/arrow-right.svg" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConnectWalletPage
