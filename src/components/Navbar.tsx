import React, { useEffect, useState } from 'react'
import Logo from './Logo'
import { useAccount, useDisconnect, useSigner } from 'wagmi'
import useWalletConnector from '../hooks/useWalletConnector'
import Button from './Button'
import { showNetworkName } from '../utils'

const Navbar = () => {
  const [networkName, setNetworkName] = useState<any>('Loading...')

  const { address, isConnected } = useAccount()
  const { connect } = useWalletConnector()
  const { disconnect } = useDisconnect()
  const { data: signer } = useSigner()

  useEffect(() => {
    async function getChainId() {
      if (signer) {
        const chainId = await signer.getChainId()
        setNetworkName(showNetworkName(chainId))
      }
    }
    getChainId()
  })

  const shortenedAddress = (address: string) =>
    `${address.slice(0, 5)}...${address.slice(-4)}`

  return (
    <div className="flex justify-between w-full px-12 py-6 bg-white">
      <Logo />

      {isConnected && address ? (
        <div className="flex">
          <div className="px-3 py-2 font-bold">{networkName}</div>
          <Button onClick={() => disconnect()}>
            {shortenedAddress(address)}
          </Button>
        </div>
      ) : (
        <Button onClick={() => connect()}>Connect</Button>
      )}
    </div>
  )
}

export default Navbar
