import React from 'react'
import Logo from './Logo'
import { useAccount, useDisconnect } from 'wagmi'
import useWalletConnector from '../hooks/useWalletConnector'
import Button from './Button'

const Navbar = () => {
  const { address, isConnected } = useAccount()
  const { connect } = useWalletConnector()
  const { disconnect } = useDisconnect()

  const shortenedAddress = (address: string) =>
    `${address.slice(0, 5)}...${address.slice(-4)}`

  return (
    <div className="flex justify-between w-full px-12 py-6 bg-white">
      <Logo />

      {isConnected && address ? (
        <Button onClick={() => disconnect()}>
          {shortenedAddress(address)}
        </Button>
      ) : (
        <Button onClick={() => connect()}>Connect</Button>
      )}
    </div>
  )
}

export default Navbar
