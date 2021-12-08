import * as React from 'react'
import renderer, { ReactTestRenderer } from 'react-test-renderer'
import { InitializationStatus, MetaMaskContext, MetaMaskContextValue } from './MetaMaskContext'
import { ExchangeContext, ExchangeContextValue } from './ExchangeContext'
import Button from 'react-bootstrap/Button'
import Header from './Header'

const ACCOUNT_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

const createMetaMaskContextValue = (): MetaMaskContextValue => {
  return {
    account: undefined,
    balance: undefined,
    initializationStatus: InitializationStatus.None,
    initialize: jest.fn(),
    connect: jest.fn(),
    getAccount: jest.fn(),
    getBalance: jest.fn(),
  }
}

const createExchangeContextValue = (): ExchangeContextValue => {
  return {
    initialized: true,
    ethBalance: undefined,
    tokenBalance: undefined,
    trades: [],
    initialize: jest.fn(),
    setAccount: jest.fn(),
    updateBalances: jest.fn(),
  }
}

const renderComponent = (metaMaskContextValue: MetaMaskContextValue, exchangeContextValue: ExchangeContextValue) =>
  renderer.create(
    <MetaMaskContext.Provider value={metaMaskContextValue}>
      <ExchangeContext.Provider value={exchangeContextValue}>
        <Header />
      </ExchangeContext.Provider>
    </MetaMaskContext.Provider>
  )

describe('<Header />', () => {
  let component: ReactTestRenderer

  it('should render when MetaMask not initialized', () => {
    const metaMaskContextValue = createMetaMaskContextValue()
    const exchangeContextValue = createExchangeContextValue()

    component = renderComponent(metaMaskContextValue, exchangeContextValue)

    expect(component.toJSON()).toMatchSnapshot()
  })

  it('should render when MetaMask initialized', () => {
    const metaMaskContextValue = {
      ...createMetaMaskContextValue(),
      initializationStatus: InitializationStatus.Initialized,
    }
    const exchangeContextValue = {
      ...createExchangeContextValue(),
      account: ACCOUNT_ADDRESS,
      ethBalance: '10500000000000000000',
      tokenBalance: '1000500000000000000000',
    }

    component = renderComponent(metaMaskContextValue, exchangeContextValue)

    expect(component.toJSON()).toMatchSnapshot()
  })

  it('should render when no account connected', () => {
    const metaMaskContextValue = {
      ...createMetaMaskContextValue(),
      initializationStatus: InitializationStatus.Initialized,
    }
    const exchangeContextValue = createExchangeContextValue()

    component = renderComponent(metaMaskContextValue, exchangeContextValue)

    expect(component.toJSON()).toMatchSnapshot()
  })

  it('should connect on click', () => {
    const metaMaskContextValue = {
      ...createMetaMaskContextValue(),
      initializationStatus: InitializationStatus.Initialized,
    }
    const exchangeContextValue = {
      ...createExchangeContextValue(),
      account: ACCOUNT_ADDRESS,
      ethBalance: '10500000000000000000',
      tokenBalance: '1000500000000000000000',
    }
    component = renderComponent(metaMaskContextValue, exchangeContextValue)

    component.root.findByType(Button).props.onClick()

    expect(metaMaskContextValue.connect).toBeCalledTimes(1)
  })
})
