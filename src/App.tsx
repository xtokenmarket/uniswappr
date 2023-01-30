import React, { useEffect, useState } from 'react'
import {
  chain,
  configureChains,
  createClient,
  useAccount,
  WagmiConfig,
  useSigner,
} from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ConnectWalletPage from './pages/ConnectWalletPage'
import MainPage from './pages/MainPage'
import NoLpPositionsPage from './pages/NoLpPositionsPage'

import { usePositions } from './hooks/usePositions'

const { provider } = configureChains(
  [chain.polygon, chain.mainnet, chain.arbitrum, chain.goerli],
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_API_KEY || '' }),
    publicProvider(),
  ]
)

const wagmiClient = createClient({
  autoConnect: true,
  provider,
})

const Main = () => {
  const { address, isConnected } = useAccount()
  const { data: signer, isError, isLoading } = useSigner()

  const [positions] = usePositions(signer)
  const hasLpPositions = !!positions

  const getPageComponent = () => {
    if(isConnected) {
      if(hasLpPositions) {
        return (
          <MainPage positions={positions} />
        )
      } else {
        return (
          <NoLpPositionsPage />
        )
      }
    }

    return <ConnectWalletPage />
  }

  return (
    <div className="relative flex flex-col w-full h-full bg-gray-50">
      <div className="mb-2.5">
        <Navbar />
      </div>
      <div className="">
      {/* <div className="min-h-[750px] flex-1 mt-2.5 mb-2.5"> */}
        {getPageComponent()}
      </div>
      {/* <div className="mt-2.5">
        <Footer />
      </div> */}
    </div>
  )
}

const App = () => (
  <WagmiConfig client={wagmiClient}>
    <Main />
  </WagmiConfig>
)

export default App
