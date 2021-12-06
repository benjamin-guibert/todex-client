import React, { FC, useEffect, useRef, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { Token } from '../contracts/Token'
import { MetaMaskContext, useMetaMaskContext } from './MetaMaskContext'
import { ExchangeContext, useExchangeContext } from './ExchangeContext'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import Header from './Header'
import MetaMaskModal from './MetaMaskModal'
import { initializeContract } from 'libraries/contracts/token'

const App: FC = () => {
  const metaMaskContextValue = useMetaMaskContext()
  const exchangeContextValue = useExchangeContext()
  const { initialize: initializeMetaMask, account } = metaMaskContextValue
  const { initialize: initializeExchange, setAccount } = exchangeContextValue
  const initializeMetaMaskRef = useRef<() => Promise<Web3Provider | undefined>>(initializeMetaMask)
  const initializeExchangeRef = useRef<(provider: Web3Provider, token: Token) => Promise<boolean>>(initializeExchange)
  const setExchangeAccountRef = useRef<(account: string | undefined) => void>(setAccount)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const provider = await initializeMetaMaskRef.current()
      if (!provider) {
        setError('MetaMask not initialized.')
        return
      }

      const token = initializeContract(provider)
      if (!token?.token) {
        setError('Error while initializing token.')
        return
      }

      const exchangeInitialized = await initializeExchangeRef.current(provider, token.token)
      if (!exchangeInitialized) {
        return setError('Error while initializing exchange.')
      }
    }

    initialize()
  }, [initializeMetaMaskRef, initializeExchangeRef])

  useEffect(() => {
    setExchangeAccountRef.current(account)
  }, [account])

  return (
    <div>
      <MetaMaskContext.Provider value={metaMaskContextValue}>
        <ExchangeContext.Provider value={exchangeContextValue}>
          <Header />
          {!!error && <Alert variant="danger">{error}</Alert>}
          <Container className="bg-dark text-light" fluid>
            <Row>
              <Col>
                <Row></Row>
                <Row></Row>
              </Col>
              <Col></Col>
              <Col>
                <Row></Row>
                <Row></Row>
              </Col>
              <Col></Col>
            </Row>
          </Container>
          <MetaMaskModal />
        </ExchangeContext.Provider>
      </MetaMaskContext.Provider>
    </div>
  )
}

export default App
