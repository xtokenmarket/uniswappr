import { useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

const useWalletConnector = () => {
  return useConnect({
    connector: new InjectedConnector(),
  })
}

export default useWalletConnector
