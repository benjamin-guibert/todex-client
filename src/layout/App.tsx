import React, { FC, useEffect, useRef, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { Token } from '../contracts/Token'
import { MetaMaskContext, useMetaMaskContext } from './MetaMaskContext'
import { ExchangeContext, useExchangeContext } from './ExchangeContext'
import Alert from 'react-bootstrap/Alert'
import Header from './Header'
import MetaMaskModal from './MetaMaskModal'
import { initializeContract } from 'libraries/contracts/token'
import Forms from './Forms'
import TradeHistory from './TradeHistory'
import Orders from './Orders'
import StyledApp, { MainContainer } from './App.style'

const App: FC = () => {
  const metaMaskContextValue = useMetaMaskContext()
  const exchangeContextValue = useExchangeContext()
  const { initialize: initializeMetaMask, getAccount, account } = metaMaskContextValue
  const { initialized, initialize: initializeExchange, setAccount } = exchangeContextValue
  const initializeMetaMaskRef = useRef<() => Promise<Web3Provider | undefined>>(initializeMetaMask)
  const getAccountRef = useRef<() => Promise<string | null | undefined>>(getAccount)
  const initializeExchangeRef = useRef<(provider: Web3Provider, token: Token) => Promise<boolean>>(initializeExchange)
  const setExchangeAccountRef = useRef<(account: string | null | undefined) => void>(setAccount)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const provider = await initializeMetaMaskRef.current()
      if (!provider) {
        setError('MetaMask not initialized.')
        return
      }

      let token: Token

      try {
        token = initializeContract(provider).token
      } catch {
        setError('Error while initializing token.')
        return
      }

      const exchangeInitialized = await initializeExchangeRef.current(provider, token)
      if (!exchangeInitialized) {
        return setError('Error while initializing exchange.')
      }

      getAccountRef.current()
    }

    initialize()
  }, [initializeMetaMaskRef, initializeExchangeRef, getAccountRef])

  useEffect(() => {
    setExchangeAccountRef.current(account)
  }, [account])

  return (
    <StyledApp className="bg-dark text-light">
      <MetaMaskContext.Provider value={metaMaskContextValue}>
        <ExchangeContext.Provider value={exchangeContextValue}>
          <Header />
          {!!error && <Alert variant="danger">{error}</Alert>}
          <MainContainer fluid>
            {initialized && (
              <>
                <Forms />
                <Orders />
                <TradeHistory />
              </>
            )}
          </MainContainer>
          <MetaMaskModal />
        </ExchangeContext.Provider>
      </MetaMaskContext.Provider>
    </StyledApp>
  )
}

export default App
