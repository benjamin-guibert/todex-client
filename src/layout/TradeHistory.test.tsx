import * as React from 'react'
import TradeHistory from './TradeHistory'
import renderer from 'react-test-renderer'
import { BigNumber } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { InitializationStatus, MetaMaskContext, MetaMaskContextValue } from './MetaMaskContext'
import { ExchangeContext, ExchangeContextValue } from './ExchangeContext'
import { TradeType } from 'models/Trade'

const createMetaMaskContextValue = (): MetaMaskContextValue => {
  return {
    account: undefined,
    balance: undefined,
    initializationStatus: InitializationStatus.Initialized,
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
    getTokenAllowance: jest.fn(),
    approveToken: jest.fn(),
    depositEther: jest.fn(),
    depositToken: jest.fn(),
    withdrawEther: jest.fn(),
    withdrawToken: jest.fn(),
  } as unknown as ExchangeContextValue
}

const renderComponent = (metaMaskContextValue: MetaMaskContextValue, exchangeContextValue: ExchangeContextValue) =>
  renderer.create(
    <MetaMaskContext.Provider value={metaMaskContextValue}>
      <ExchangeContext.Provider value={exchangeContextValue}>
        <TradeHistory />
      </ExchangeContext.Provider>
    </MetaMaskContext.Provider>
  )

describe('<TradeHistory />', () => {
  it('should render when trades', () => {
    const metaMaskContextValue = createMetaMaskContextValue()
    const exchangeContextValue = {
      ...createExchangeContextValue(),
      trades: [
        {
          orderId: '2',
          timestamp: new Date(BigNumber.from('1612345678').toNumber()),
          type: TradeType.Buy,
          amount: parseEther('1000'),
          unitPrice: parseEther('0.001').toString(),
          totalPrice: parseEther('1'),
        },
        {
          orderId: '1',
          timestamp: new Date(BigNumber.from('1612344678').toNumber()),
          type: TradeType.Sell,
          amount: parseEther('1000'),
          unitPrice: parseEther('0.001').toString(),
          totalPrice: parseEther('1'),
        },
      ],
    }
    const result = renderComponent(metaMaskContextValue, exchangeContextValue)

    expect(result.toJSON()).toMatchSnapshot()
  })

  it('should render when no trades', () => {
    const metaMaskContextValue = createMetaMaskContextValue()
    const exchangeContextValue = createExchangeContextValue()
    const result = renderComponent(metaMaskContextValue, exchangeContextValue)

    expect(result.toJSON()).toMatchSnapshot()
  })
})
