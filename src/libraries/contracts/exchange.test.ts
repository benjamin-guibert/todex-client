import { Web3Provider } from '@ethersproject/providers'
import { Token } from '../../contracts/Token'
import { Exchange } from '../../contracts/Exchange'
import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from 'ethers/lib/utils'
import { BURN_ADDRESS } from './helpers'
import {
  getAllTrades,
  getEthBalance,
  getTokenBalance,
  initializeContract,
  subscribeTrades,
  TradeType,
  unsubscribeTrades,
} from './exchange'

const ETHER_ADDRESS = BURN_ADDRESS
const TOKEN_ADDRESS = '0x1'
process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS = TOKEN_ADDRESS
const timestamp = BigNumber.from('1612345678')
const provider = {
  getSigner: jest.fn(),
} as unknown as Web3Provider
const token = {
  address: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
} as unknown as Token
const ethBalanceOfMock = jest.fn()
const tokenBalanceOfMock = jest.fn()
const onMock = jest.fn()
const offMock = jest.fn()
const queryFilterMock = jest.fn()
const TradeMock = jest.fn()
const exchange = {
  ethBalanceOf: ethBalanceOfMock,
  tokenBalanceOf: tokenBalanceOfMock,
  on: onMock,
  off: offMock,
  filters: {
    Trade: TradeMock,
  },
  queryFilter: queryFilterMock,
} as unknown as Exchange

beforeEach(() => {
  jest.clearAllMocks()
})

describe('initializeContract()', () => {
  it('should return handler when address defined', () => {
    process.env.REACT_APP_EXCHANGE_CONTRACT_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    const handler = initializeContract(provider, token)

    expect(handler?.token).toEqual(token)
    expect(handler?.exchange).toBeDefined()
    expect(handler?.tradeListeners).toEqual([])
  })

  it('should throw error when address not defined', () => {
    process.env.REACT_APP_EXCHANGE_CONTRACT_ADDRESS = ''

    expect(() => initializeContract(provider, token)).toThrow('Exchange address missing')
  })
})

describe('getEthBalance()', () => {
  const account = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'
  const amount = BigNumber.from('1000000000000000000')

  it('should return balance when success', async () => {
    const handler = {
      token,
      exchange,
      tradeListeners: [],
    }
    ethBalanceOfMock.mockResolvedValueOnce(amount)

    const balance = await getEthBalance(handler, account)

    expect(balance).toBe(amount)
    expect(ethBalanceOfMock).toBeCalledTimes(1)
    expect(ethBalanceOfMock.mock.calls[0][0]).toBe(account)
  })

  it('should reject when error', () => {
    const handler = {
      token,
      exchange,
      tradeListeners: [],
    }
    ethBalanceOfMock.mockRejectedValueOnce('error')

    expect(getEthBalance(handler, account)).rejects.toBe('error')

    expect(ethBalanceOfMock).toBeCalledTimes(1)
    expect(ethBalanceOfMock.mock.calls[0][0]).toBe(account)
  })
})

describe('getTokenBalance()', () => {
  const account = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'
  const amount = BigNumber.from('1000000000000000000')

  it('should return balance when success', async () => {
    const handler = {
      token,
      exchange,
      tradeListeners: [],
    }
    tokenBalanceOfMock.mockResolvedValueOnce(amount)

    const balance = await getTokenBalance(handler, account)

    expect(balance).toBe(amount)
    expect(tokenBalanceOfMock).toBeCalledTimes(1)
    expect(tokenBalanceOfMock.mock.calls[0][0]).toBe(token.address)
    expect(tokenBalanceOfMock.mock.calls[0][1]).toBe(account)
  })

  it('should reject when error', () => {
    const handler = {
      token,
      exchange,
      tradeListeners: [],
    }
    tokenBalanceOfMock.mockRejectedValueOnce('error')

    expect(getTokenBalance(handler, account)).rejects.toBe('error')

    expect(tokenBalanceOfMock).toBeCalledTimes(1)
    expect(tokenBalanceOfMock.mock.calls[0][0]).toBe(token.address)
    expect(tokenBalanceOfMock.mock.calls[0][1]).toBe(account)
  })
})

describe('subscribeTrades()', () => {
  it('should subscribe when success', () => {
    const handler = {
      token,
      exchange,
      tradeListeners: [jest.fn(), jest.fn()],
    }
    const callback = jest.fn()
    const sellAccount = '0xA'
    const sellToken = ETHER_ADDRESS
    const sellAmount = parseEther('1')
    const buyAccount = '0xB'
    const buyToken = '0x1'
    const buyAmount = parseEther('1000')

    const id = subscribeTrades(handler, callback)

    expect(id).toBe(2)
    expect(handler.tradeListeners).toHaveLength(3)
    expect(onMock).toBeCalledTimes(1)
    expect(onMock.mock.calls[0][0]).toBe('Trade')
    const onCallback = onMock.mock.calls[0][1]
    expect(onCallback).toBeDefined()

    onCallback(BigNumber.from(1), sellAccount, sellToken, sellAmount, buyAccount, buyToken, buyAmount, timestamp)

    expect(callback).toBeCalledTimes(1)
    expect(callback.mock.calls[0][0]).toEqual({
      orderId: '1',
      timestamp: new Date(timestamp.mul(1000).toNumber()),
      type: TradeType.Buy,
      amount: buyAmount.toString(),
      unitPrice: parseEther('0.001').toString(),
      totalPrice: sellAmount.toString(),
    })
  })

  it('should throw when error', () => {
    const handler = {
      token,
      exchange,
      tradeListeners: [],
    }
    const callback = jest.fn()
    onMock.mockImplementationOnce(() => {
      throw new Error('error')
    })

    expect(() => subscribeTrades(handler, callback)).toThrow('error')

    expect(onMock).toBeCalledTimes(1)
  })
})

describe('unsubscribeTrades', () => {
  it('should unsubscribe when success', () => {
    const handler = {
      token,
      exchange,
      tradeListeners: [jest.fn(), jest.fn(), jest.fn()],
    }

    unsubscribeTrades(handler, 1)

    expect(handler.tradeListeners[0]).toBeDefined()
    expect(handler.tradeListeners[1]).toBeNull()
    expect(handler.tradeListeners[2]).toBeDefined()
    expect(offMock).toBeCalledTimes(1)
    expect(offMock.mock.calls[0][0]).toBe('Trade')
    expect(offMock.mock.calls[0][1]).toBeDefined()
  })

  it('should do nothing when unknown ID', () => {
    const handler = {
      token,
      exchange,
      tradeListeners: [jest.fn(), jest.fn(), jest.fn()],
    }

    unsubscribeTrades(handler, 4)

    expect(handler.tradeListeners[0]).toBeDefined()
    expect(handler.tradeListeners[1]).toBeDefined()
    expect(handler.tradeListeners[2]).toBeDefined()
    expect(offMock).toBeCalledTimes(0)
  })

  it('should do nothing when unsubscribed', () => {
    const handler = {
      token,
      exchange,
      tradeListeners: [jest.fn(), null, jest.fn()],
    }

    unsubscribeTrades(handler, 1)

    expect(handler.tradeListeners[0]).toBeDefined()
    expect(handler.tradeListeners[1]).toBeNull()
    expect(handler.tradeListeners[2]).toBeDefined()
    expect(offMock).toBeCalledTimes(0)
  })

  it('should throw when error', () => {
    const handler = {
      token,
      exchange,
      tradeListeners: [jest.fn(), jest.fn(), jest.fn()],
    }
    offMock.mockImplementation(() => {
      throw new Error('error')
    })

    expect(() => unsubscribeTrades(handler, 1)).toThrow('error')
  })
})

describe('getAllTrades()', () => {
  it('should return trades when success', async () => {
    const sellAccount = '0xA'
    const ethToken = ETHER_ADDRESS
    const ethAmount = parseEther('1')
    const buyAccount = '0xB'
    const tokenToken = '0x1'
    const tokenAmount = parseEther('1000')
    const events = [
      {
        args: {
          orderId: BigNumber.from('1'),
          sellAccount,
          sellToken: ethToken,
          sellAmount: ethAmount,
          buyAccount,
          buyToken: tokenToken,
          buyAmount: tokenAmount,
          timestamp,
        },
      },
      {
        args: {
          orderId: BigNumber.from('2'),
          sellAccount,
          sellToken: tokenToken,
          sellAmount: tokenAmount,
          buyAccount,
          buyToken: ethToken,
          buyAmount: ethAmount,
          timestamp: timestamp.add(1000),
        },
      },
    ]
    const handler = {
      token,
      exchange,
      tradeListeners: [],
    }
    queryFilterMock.mockReturnValue(events)

    const trades = await getAllTrades(handler)

    expect(trades).toEqual([
      {
        orderId: '2',
        timestamp: new Date(timestamp.add(1000).mul(1000).toNumber()),
        type: TradeType.Sell,
        amount: tokenAmount.toString(),
        unitPrice: parseEther('0.001').toString(),
        totalPrice: ethAmount.toString(),
      },
      {
        orderId: '1',
        timestamp: new Date(timestamp.mul(1000).toNumber()),
        type: TradeType.Buy,
        amount: tokenAmount.toString(),
        unitPrice: parseEther('0.001').toString(),
        totalPrice: ethAmount.toString(),
      },
    ])
    expect(TradeMock).toBeCalledTimes(1)
    expect(queryFilterMock).toBeCalledTimes(1)
  })

  it('should reject when error', () => {
    const handler = {
      token,
      exchange,
      tradeListeners: [],
    }
    queryFilterMock.mockRejectedValueOnce('error')

    expect(getAllTrades(handler)).rejects.toBe('error')

    expect(queryFilterMock).toBeCalledTimes(1)
  })
})
