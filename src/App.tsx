import React, { useEffect, useState } from 'react'
import { Toast } from 'flowbite-react'
import {
  chain,
  configureChains,
  createClient,
  useAccount,
  WagmiConfig,
  useSigner,
  useSwitchNetwork,
} from 'wagmi'
import { getNetwork } from '@wagmi/core'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ConnectWalletPage from './pages/ConnectWalletPage'
import MainPage from './pages/MainPage'
import NoLpPositionsPage from './pages/NoLpPositionsPage'
import { usePositions } from './hooks/usePositions'

const { provider } = configureChains(
  [chain.polygon, chain.arbitrum, chain.optimism],
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_API_KEY || '' }),
    publicProvider(),
  ]
)

const wagmiClient = createClient({
  autoConnect: true,
  provider,
})

const SUPPORTED_NETWORK_IDS = [10, 137, 42161]

const Main = () => {
  const { isConnected } = useAccount()
  const { data: signer } = useSigner()
  const { chain } = getNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork()

  const [positions] = usePositions(signer)
  const hasLpPositions = !!positions

  const getPageComponent = () => {
    if (isConnected) {
      const supportedNetwork = SUPPORTED_NETWORK_IDS.includes(
        chain ? chain.id : 1234
      )
      if (positions === undefined) {
        return (
          <div className="flex flex-col h-full px-12 pt-10 text-center">
            <div className="flex flex-col mx-auto xl:flex-column">
              <div className="w-[850px]">
                {supportedNetwork
                  ? 'Loading positions...'
                  : 'Unsupported Network'}
              </div>
            </div>
          </div>
        )
      }

      if (hasLpPositions) {
        return <MainPage positions={positions} />
      } else {
        return <NoLpPositionsPage />
      }
    }

    return <ConnectWalletPage />
  }

  return (
    <div className="relative flex flex-col w-full h-full bg-gray-50">
      <div className="mb-2.5">
        <Navbar />
      </div>
      <div className="flex items-center w-50 mx-10 p-2 bg-purple-50">
        <div className="">
          <p>
            Uniswappr is available on Arbitrum, Optimism and Polygon. Uniswappr
            is unaudited and still undergoing testing.{' '}
          </p>
          <p>
            Do not use Uniswappr for high value transactions or low liquidity
            tokens. Have any feedback or need help? Join us in the
            #troubleshooting channel of the{' '}
            <a
              href="https://discord.gg/QCp8QBWB72"
              rel="noreferrer"
              target="_blank"
              className="underline"
            >
              xToken discord
            </a>
            .
          </p>
        </div>
      </div>
      <div className="">{getPageComponent()}</div>
    </div>
  )
}

const App = () => (
  <WagmiConfig client={wagmiClient}>
    <Main />
  </WagmiConfig>
)

export default App
