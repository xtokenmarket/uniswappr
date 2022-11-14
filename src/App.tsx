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
    <div className="h-full w-full flex flex-col bg-gray-50 relative">
      <Navbar />
      <div className="min-h-[750px] flex-1 mt-2.5 mb-2.5">
        <PageComponent />
      </div>
      <Footer />
    </div>
  )
}

export default App
