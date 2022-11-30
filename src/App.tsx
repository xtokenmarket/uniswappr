import React from 'react'
import {
  chain,
  configureChains,
  createClient,
  useAccount,
  WagmiConfig,
} from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ConnectWalletPage from './pages/ConnectWalletPage'
import MainPage from './pages/MainPage'
import NoLpPositionsPage from './pages/NoLpPositionsPage'

const { provider } = configureChains(
  [chain.mainnet, chain.goerli],
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

  // @todo query the smart contract for this information
  const hasLpPositions = Math.random() < 0.5

  const PageComponent = isConnected
    ? hasLpPositions
      ? MainPage
      : NoLpPositionsPage
    : ConnectWalletPage

  return (
    <div className="relative flex flex-col w-full h-full bg-gray-50">
      <div className="mb-2.5">
        <Navbar />
      </div>
      <div className="min-h-[750px] flex-1 mt-2.5 mb-2.5">
        <PageComponent />
      </div>
      <div className="mt-2.5">
        <Footer />
      </div>
    </div>
  )
}

const App = () => (
  <WagmiConfig client={wagmiClient}>
    <Main />
  </WagmiConfig>
)

export default App
