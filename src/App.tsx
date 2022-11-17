import React from 'react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ConnectWalletPage from './pages/ConnectWalletPage'
import MainPage from './pages/MainPage'
import NoLpPositionsPage from './pages/NoLpPositionsPage'

const App = () => {
  const walletConnected = true
  const hasLpPositions = true

  const PageComponent = walletConnected
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

export default App
