import { Web3Provider } from '@ethersproject/providers'
import { Token } from 'contracts/Token'
import { Exchange } from 'contracts/Exchange'
import { BigNumber } from '@ethersproject/bignumber'
import { parseEther, parseUnits } from 'ethers/lib/utils'
import { BURN_ADDRESS } from './helpers'
import {
  approveToken,
  createOrder,
  depositEther,
  depositToken,
  ExchangeHandler,
  getAllTrades,
  getEthBalance,
  getPendingOrders,
  getTokenAllowance,
  getTokenBalance,
  initializeContract,
  subscribeCancelOrders,
  subscribeCreateOrders,
  subscribeTrades,
  unsubscribeCancelOrders,
  unsubscribeCreateOrders,
  unsubscribeTrades,
  withdrawEther,
  withdrawToken,
} from './exchange'
import { TradeType } from 'models/Trade'
import Order from 'models/Order'

const ETHER_ADDRESS = BURN_ADDRESS
const TOKEN_ADDRESS = '0x1'
const EXCHANGE_ADDRESS = '0x2'
process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS = TOKEN_ADDRESS
const timestamp = BigNumber.from('1612345678')
const provider = {
  getSigner: jest.fn(),
} as unknown as Web3Provider
const allowanceMock = jest.fn()
const approveMock = jest.fn()
const token = {
  address: TOKEN_ADDRESS,
  allowance: allowanceMock,
  approve: approveMock,
} as unknown as Token
const ethBalanceOfMock = jest.fn()
const tokenBalanceOfMock = jest.fn()
const onMock = jest.fn()
const offMock = jest.fn()
const queryFilterMock = jest.fn()
const TradeMock = jest.fn()
const CreateOrderMock = jest.fn()
const CancelOrderMock = jest.fn()
const depositEtherMock = jest.fn()
const depositTokenMock = jest.fn()
const withdrawEtherMock = jest.fn()
const withdrawTokenMock = jest.fn()
const createOrderMock = jest.fn()
const exchange = {
  address: EXCHANGE_ADDRESS,
  ethBalanceOf: ethBalanceOfMock,
  tokenBalanceOf: tokenBalanceOfMock,
  on: onMock,
  off: offMock,
  filters: {
    Trade: TradeMock,
    CreateOrder: CreateOrderMock,
    CancelOrder: CancelOrderMock,
  },
  queryFilter: queryFilterMock,
  depositEther: depositEtherMock,
  depositToken: depositTokenMock,
  withdrawEther: withdrawEtherMock,
  withdrawToken: withdrawTokenMock,
  createOrder: createOrderMock,
} as unknown as Exchange

const createHandler = (): ExchangeHandler => {
  return {
    token,
    exchange,
    tradeListeners: [],
    createOrderListeners: [],
    cancelOrderListeners: [],
  }
}

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
    const handler = createHandler()
    ethBalanceOfMock.mockResolvedValueOnce(amount)

    const balance = await getEthBalance(handler, account)

    expect(balance).toBe(amount)
    expect(ethBalanceOfMock).toBeCalledTimes(1)
    expect(ethBalanceOfMock.mock.calls[0][0]).toBe(account)
  })

  it('should reject when error', () => {
    const handler = createHandler()
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
    const handler = createHandler()
    tokenBalanceOfMock.mockResolvedValueOnce(amount)

    const balance = await getTokenBalance(handler, account)

    expect(balance).toBe(amount)
    expect(tokenBalanceOfMock).toBeCalledTimes(1)
    expect(tokenBalanceOfMock.mock.calls[0][0]).toBe(token.address)
    expect(tokenBalanceOfMock.mock.calls[0][1]).toBe(account)
  })

  it('should reject when error', () => {
    const handler = createHandler()
    tokenBalanceOfMock.mockRejectedValueOnce('error')

    expect(getTokenBalance(handler, account)).rejects.toBe('error')

    expect(tokenBalanceOfMock).toBeCalledTimes(1)
    expect(tokenBalanceOfMock.mock.calls[0][0]).toBe(token.address)
    expect(tokenBalanceOfMock.mock.calls[0][1]).toBe(account)
  })
})

describe('subscribeTrades()', () => {
  it('should subscribe when success', () => {
    const handler = createHandler()
    handler.tradeListeners = [jest.fn(), jest.fn()]
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
      sellAccount,
      buyAccount,
      amount: buyAmount.toString(),
      unitPrice: parseEther('0.001').toString(),
      totalPrice: sellAmount.toString(),
    })
  })

  it('should throw when error', () => {
    const handler = createHandler()
    const callback = jest.fn()
    onMock.mockImplementationOnce(() => {
      throw new Error('error')
    })

    expect(() => subscribeTrades(handler, callback)).toThrow('error')

    expect(onMock).toBeCalledTimes(1)
  })
})

describe('unsubscribeTrades()', () => {
  it('should unsubscribe when success', () => {
    const handler = createHandler()
    handler.tradeListeners = [jest.fn(), jest.fn(), jest.fn()]

    unsubscribeTrades(handler, 1)

    expect(handler.tradeListeners[0]).toBeDefined()
    expect(handler.tradeListeners[1]).toBeNull()
    expect(handler.tradeListeners[2]).toBeDefined()
    expect(offMock).toBeCalledTimes(1)
    expect(offMock.mock.calls[0][0]).toBe('Trade')
    expect(offMock.mock.calls[0][1]).toBeDefined()
  })

  it('should do nothing when unknown ID', () => {
    const handler = createHandler()
    handler.tradeListeners = [jest.fn(), jest.fn(), jest.fn()]

    unsubscribeTrades(handler, 4)

    expect(handler.tradeListeners[0]).toBeDefined()
    expect(handler.tradeListeners[1]).toBeDefined()
    expect(handler.tradeListeners[2]).toBeDefined()
    expect(offMock).toBeCalledTimes(0)
  })

  it('should do nothing when unsubscribed', () => {
    const handler = createHandler()
    handler.tradeListeners = [jest.fn(), null, jest.fn()]

    unsubscribeTrades(handler, 1)

    expect(handler.tradeListeners[0]).toBeDefined()
    expect(handler.tradeListeners[1]).toBeNull()
    expect(handler.tradeListeners[2]).toBeDefined()
    expect(offMock).toBeCalledTimes(0)
  })

  it('should throw when error', () => {
    const handler = createHandler()
    handler.tradeListeners = [jest.fn(), jest.fn(), jest.fn()]

    offMock.mockImplementation(() => {
      throw new Error('error')
    })

    expect(() => unsubscribeTrades(handler, 1)).toThrow('error')
  })
})

describe('subscribeCreateOrders()', () => {
  it('should subscribe when success', () => {
    const handler = createHandler()
    handler.createOrderListeners = [jest.fn(), jest.fn()]
    const callback = jest.fn()
    const account = '0xA'
    const sellToken = ETHER_ADDRESS
    const sellAmount = parseEther('1')
    const buyToken = '0x1'
    const buyAmount = parseEther('1000')

    const id = subscribeCreateOrders(handler, callback)

    expect(id).toBe(2)
    expect(handler.createOrderListeners).toHaveLength(3)
    expect(onMock).toBeCalledTimes(1)
    expect(onMock.mock.calls[0][0]).toBe('CreateOrder')
    const onCallback = onMock.mock.calls[0][1]
    expect(onCallback).toBeDefined()

    onCallback(BigNumber.from(1), account, sellToken, sellAmount, buyToken, buyAmount, timestamp)

    expect(callback).toBeCalledTimes(1)
    expect(callback.mock.calls[0][0]).toEqual({
      id: '1',
      account,
      timestamp: new Date(timestamp.mul(1000).toNumber()),
      type: TradeType.Buy,
      amount: buyAmount.toString(),
      unitPrice: parseEther('0.001').toString(),
      totalPrice: sellAmount.toString(),
    })
  })

  it('should throw when error', () => {
    const handler = createHandler()
    const callback = jest.fn()
    onMock.mockImplementationOnce(() => {
      throw new Error('error')
    })

    expect(() => subscribeCreateOrders(handler, callback)).toThrow('error')

    expect(onMock).toBeCalledTimes(1)
  })
})

describe('unsubscribeCreateOrders()', () => {
  it('should unsubscribe when success', () => {
    const handler = createHandler()
    handler.createOrderListeners = [jest.fn(), jest.fn(), jest.fn()]

    unsubscribeCreateOrders(handler, 1)

    expect(handler.createOrderListeners[0]).toBeDefined()
    expect(handler.createOrderListeners[1]).toBeNull()
    expect(handler.createOrderListeners[2]).toBeDefined()
    expect(offMock).toBeCalledTimes(1)
    expect(offMock.mock.calls[0][0]).toBe('CreateOrder')
    expect(offMock.mock.calls[0][1]).toBeDefined()
  })

  it('should do nothing when unknown ID', () => {
    const handler = createHandler()
    handler.createOrderListeners = [jest.fn(), jest.fn(), jest.fn()]

    unsubscribeCreateOrders(handler, 4)

    expect(handler.createOrderListeners[0]).toBeDefined()
    expect(handler.createOrderListeners[1]).toBeDefined()
    expect(handler.createOrderListeners[2]).toBeDefined()
    expect(offMock).toBeCalledTimes(0)
  })

  it('should do nothing when unsubscribed', () => {
    const handler = createHandler()
    handler.createOrderListeners = [jest.fn(), null, jest.fn()]

    unsubscribeCreateOrders(handler, 1)

    expect(handler.createOrderListeners[0]).toBeDefined()
    expect(handler.createOrderListeners[1]).toBeNull()
    expect(handler.createOrderListeners[2]).toBeDefined()
    expect(offMock).toBeCalledTimes(0)
  })

  it('should throw when error', () => {
    const handler = createHandler()
    handler.createOrderListeners = [jest.fn(), jest.fn(), jest.fn()]

    offMock.mockImplementation(() => {
      throw new Error('error')
    })

    expect(() => unsubscribeCreateOrders(handler, 1)).toThrow('error')
  })
})

describe('subscribeCancelOrders()', () => {
  it('should subscribe when success', () => {
    const handler = createHandler()
    handler.cancelOrderListeners = [jest.fn(), jest.fn()]
    const callback = jest.fn()
    const orderId = BigNumber.from(1)

    const id = subscribeCancelOrders(handler, callback)

    expect(id).toBe(2)
    expect(handler.cancelOrderListeners).toHaveLength(3)
    expect(onMock).toBeCalledTimes(1)
    expect(onMock.mock.calls[0][0]).toBe('CancelOrder')
    const onCallback = onMock.mock.calls[0][1]
    expect(onCallback).toBeDefined()

    onCallback(orderId)

    expect(callback).toBeCalledTimes(1)
    expect(callback.mock.calls[0][0]).toEqual(orderId)
  })

  it('should throw when error', () => {
    const handler = createHandler()
    const callback = jest.fn()
    onMock.mockImplementationOnce(() => {
      throw new Error('error')
    })

    expect(() => subscribeCancelOrders(handler, callback)).toThrow('error')

    expect(onMock).toBeCalledTimes(1)
  })
})

describe('unsubscribeCancelOrders()', () => {
  it('should unsubscribe when success', () => {
    const handler = createHandler()
    handler.cancelOrderListeners = [jest.fn(), jest.fn(), jest.fn()]

    unsubscribeCancelOrders(handler, 1)

    expect(handler.cancelOrderListeners[0]).toBeDefined()
    expect(handler.cancelOrderListeners[1]).toBeNull()
    expect(handler.cancelOrderListeners[2]).toBeDefined()
    expect(offMock).toBeCalledTimes(1)
    expect(offMock.mock.calls[0][0]).toBe('CancelOrder')
    expect(offMock.mock.calls[0][1]).toBeDefined()
  })

  it('should do nothing when unknown ID', () => {
    const handler = createHandler()
    handler.cancelOrderListeners = [jest.fn(), jest.fn(), jest.fn()]

    unsubscribeCreateOrders(handler, 4)

    expect(handler.cancelOrderListeners[0]).toBeDefined()
    expect(handler.cancelOrderListeners[1]).toBeDefined()
    expect(handler.cancelOrderListeners[2]).toBeDefined()
    expect(offMock).toBeCalledTimes(0)
  })

  it('should do nothing when unsubscribed', () => {
    const handler = createHandler()
    handler.cancelOrderListeners = [jest.fn(), null, jest.fn()]

    unsubscribeCreateOrders(handler, 1)

    expect(handler.cancelOrderListeners[0]).toBeDefined()
    expect(handler.cancelOrderListeners[1]).toBeNull()
    expect(handler.cancelOrderListeners[2]).toBeDefined()
    expect(offMock).toBeCalledTimes(0)
  })

  it('should throw when error', () => {
    const handler = createHandler()
    handler.cancelOrderListeners = [jest.fn(), jest.fn(), jest.fn()]

    offMock.mockImplementation(() => {
      throw new Error('error')
    })

    expect(() => unsubscribeCancelOrders(handler, 1)).toThrow('error')
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
    const handler = createHandler()
    queryFilterMock.mockReturnValue(events)

    const trades = await getAllTrades(handler)

    expect(trades).toEqual([
      {
        orderId: '2',
        timestamp: new Date(timestamp.add(1000).mul(1000).toNumber()),
        type: TradeType.Sell,
        sellAccount,
        buyAccount,
        amount: tokenAmount.toString(),
        unitPrice: parseEther('0.001').toString(),
        totalPrice: ethAmount.toString(),
      },
      {
        orderId: '1',
        timestamp: new Date(timestamp.mul(1000).toNumber()),
        type: TradeType.Buy,
        sellAccount,
        buyAccount,
        amount: tokenAmount.toString(),
        unitPrice: parseEther('0.001').toString(),
        totalPrice: ethAmount.toString(),
      },
    ])
    expect(TradeMock).toBeCalledTimes(1)
    expect(queryFilterMock).toBeCalledTimes(1)
  })

  it('should return limited trades', async () => {
    const sellAccount = '0xA'
    const ethToken = ETHER_ADDRESS
    const ethAmount = parseEther('1')
    const buyAccount = '0xB'
    const tokenToken = '0x1'
    const tokenAmount = parseEther('1000')
    const createTrade = (id: number, timestamp: BigNumber) => {
      return {
        args: {
          orderId: BigNumber.from(id),
          sellAccount,
          sellToken: ethToken,
          sellAmount: ethAmount,
          buyAccount,
          buyToken: tokenToken,
          buyAmount: tokenAmount,
          timestamp,
        },
      }
    }
    const events = []
    for (let index = 1; index <= 30; index++) {
      events.push(createTrade(index, BigNumber.from(timestamp.toNumber() + index * 10000)))
    }
    const handler = createHandler()
    queryFilterMock.mockReturnValue(events)

    const trades = await getAllTrades(handler)

    expect(trades).toHaveLength(20)
    expect(trades[0].orderId).toBe('30')
    expect(trades[19].orderId).toBe('11')
    expect(TradeMock).toBeCalledTimes(1)
    expect(queryFilterMock).toBeCalledTimes(1)
  })

  it('should reject when error', () => {
    const handler = createHandler()
    queryFilterMock.mockRejectedValueOnce('error')

    expect(getAllTrades(handler)).rejects.toBe('error')

    expect(queryFilterMock).toBeCalledTimes(1)
  })
})

describe('getPendingOrders()', () => {
  it('should return pending orders when success', async () => {
    const account = '0xA'
    const ethToken = ETHER_ADDRESS
    const ethAmount = parseEther('1')
    const tokenToken = '0x1'
    const tokenAmount = parseEther('1000')
    const events = [
      {
        args: {
          id: BigNumber.from('1'),
          account,
          sellToken: ethToken,
          sellAmount: ethAmount,
          buyToken: tokenToken,
          buyAmount: tokenAmount,
          timestamp,
        },
      },
      {
        args: {
          id: BigNumber.from('2'),
          account,
          sellToken: tokenToken,
          sellAmount: tokenAmount,
          buyToken: ethToken,
          buyAmount: ethAmount,
          timestamp: timestamp.add(1000),
        },
      },
      {
        args: {
          id: BigNumber.from('3'),
          account,
          sellToken: tokenToken,
          sellAmount: tokenAmount,
          buyToken: ethToken,
          buyAmount: ethAmount,
          timestamp: timestamp.add(2000),
        },
      },
      {
        args: {
          id: BigNumber.from('4'),
          account,
          sellToken: tokenToken,
          sellAmount: tokenAmount,
          buyToken: ethToken,
          buyAmount: ethAmount,
          timestamp: timestamp.add(3000),
        },
      },
    ]
    const handler = createHandler()
    CreateOrderMock.mockReturnValueOnce('CreateOrder')
    CancelOrderMock.mockReturnValueOnce('CancelOrder')
    TradeMock.mockReturnValueOnce('Trade')
    queryFilterMock.mockImplementation((event: string) => {
      switch (event) {
        case 'CreateOrder':
          return Promise.resolve(events)
        case 'CancelOrder':
          return Promise.resolve([{ args: { ...events[2].args, orderId: BigNumber.from('3') } }])
        case 'Trade':
          return Promise.resolve([{ args: { ...events[1].args, orderId: BigNumber.from('2') } }])
        default:
          return Promise.resolve([])
      }
    })

    const orders = await getPendingOrders(handler)

    expect(orders).toEqual([
      {
        id: '4',
        timestamp: new Date(timestamp.add(3000).mul(1000).toNumber()),
        type: TradeType.Sell,
        account,
        amount: tokenAmount.toString(),
        unitPrice: parseEther('0.001').toString(),
        totalPrice: ethAmount.toString(),
      },
      {
        id: '1',
        timestamp: new Date(timestamp.mul(1000).toNumber()),
        type: TradeType.Buy,
        account,
        amount: tokenAmount.toString(),
        unitPrice: parseEther('0.001').toString(),
        totalPrice: ethAmount.toString(),
      },
    ])
    expect(CreateOrderMock).toBeCalledTimes(1)
    expect(CancelOrderMock).toBeCalledTimes(1)
    expect(TradeMock).toBeCalledTimes(1)
    expect(queryFilterMock).toBeCalledTimes(3)
  })

  it('should return limited orders', async () => {
    const ethToken = ETHER_ADDRESS
    const ethAmount = parseEther('1')
    const account = '0xB'
    const tokenToken = '0x1'
    const tokenAmount = parseEther('1000')
    const createOrder = (id: number, timestamp: BigNumber) => {
      return {
        args: {
          id: BigNumber.from(id),
          account,
          sellToken: ethToken,
          sellAmount: ethAmount,
          buyToken: tokenToken,
          buyAmount: tokenAmount,
          timestamp,
        },
      }
    }
    const events = [] as unknown[]
    for (let index = 1; index <= 30; index++) {
      events.push(createOrder(index, BigNumber.from(timestamp.toNumber() + index * 10000)))
    }
    const handler = createHandler()
    CreateOrderMock.mockReturnValueOnce('CreateOrder')
    queryFilterMock.mockImplementation((event: string) => {
      switch (event) {
        case 'CreateOrder':
          return Promise.resolve(events)
        default:
          return Promise.resolve([])
      }
    })

    const orders = await getPendingOrders(handler)

    expect(orders).toHaveLength(20)
    expect(orders[0].id).toBe('30')
    expect(orders[19].id).toBe('11')
    expect(CreateOrderMock).toBeCalledTimes(1)
    expect(CancelOrderMock).toBeCalledTimes(1)
    expect(TradeMock).toBeCalledTimes(1)
    expect(queryFilterMock).toBeCalledTimes(3)
  })

  it('should reject when error', () => {
    const handler = createHandler()
    queryFilterMock.mockRejectedValueOnce('error')

    expect(getPendingOrders(handler)).rejects.toBe('error')

    expect(queryFilterMock).toBeCalledTimes(1)
  })
})

describe('getTokenAllowance()', () => {
  const account = '0x3'

  it('should return allowance when success', async () => {
    const handler = createHandler()
    const allowance = BigNumber.from('1000')
    allowanceMock.mockResolvedValueOnce(allowance)

    const result = await getTokenAllowance(handler, account)

    expect(result).toBe(allowance)
    expect(allowanceMock).toBeCalledTimes(1)
    expect(allowanceMock.mock.calls[0][0]).toBe(account)
    expect(allowanceMock.mock.calls[0][1]).toBe(EXCHANGE_ADDRESS)
  })

  it('should throw when error', () => {
    const handler = createHandler()
    allowanceMock.mockRejectedValueOnce('error')

    expect(getTokenAllowance(handler, account)).rejects.toBe('error')
    expect(allowanceMock).toBeCalledTimes(1)
  })
})

describe('approveToken()', () => {
  const amount = BigNumber.from('1000')

  it('should approve when success', () => {
    const handler = createHandler()

    approveToken(handler, amount)

    expect(approveMock).toBeCalledTimes(1)
    expect(approveMock.mock.calls[0][0]).toBe(EXCHANGE_ADDRESS)
    expect(approveMock.mock.calls[0][1]).toBe(amount)
  })

  it('should throw when error', () => {
    const handler = createHandler()
    approveMock.mockRejectedValueOnce('error')

    expect(approveToken(handler, amount)).rejects.toBe('error')
    expect(approveMock).toBeCalledTimes(1)
  })
})

describe('depositEther()', () => {
  const amount = BigNumber.from('1000')

  it('should approve when success', () => {
    const handler = createHandler()

    depositEther(handler, amount)

    expect(depositEtherMock).toBeCalledTimes(1)
    expect(depositEtherMock.mock.calls[0][0]).toEqual({ value: amount })
  })

  it('should throw when error', () => {
    const handler = createHandler()
    depositEtherMock.mockRejectedValueOnce('error')

    expect(depositEther(handler, amount)).rejects.toBe('error')
    expect(depositEtherMock).toBeCalledTimes(1)
  })
})

describe('depositToken()', () => {
  const amount = BigNumber.from('1000')

  it('should approve when success', () => {
    const handler = createHandler()

    depositToken(handler, amount)

    expect(depositTokenMock).toBeCalledTimes(1)
    expect(depositTokenMock.mock.calls[0][0]).toBe(TOKEN_ADDRESS)
    expect(depositTokenMock.mock.calls[0][1]).toEqual(amount)
  })

  it('should throw when error', () => {
    const handler = createHandler()
    depositTokenMock.mockRejectedValueOnce('error')

    expect(depositToken(handler, amount)).rejects.toBe('error')
    expect(depositTokenMock).toBeCalledTimes(1)
  })
})

describe('withdrawEther()', () => {
  const amount = BigNumber.from('1000')

  it('should approve when success', () => {
    const handler = createHandler()

    withdrawEther(handler, amount)

    expect(withdrawEtherMock).toBeCalledTimes(1)
    expect(withdrawEtherMock.mock.calls[0][0]).toEqual(amount)
  })

  it('should throw when error', () => {
    const handler = createHandler()
    withdrawEtherMock.mockRejectedValueOnce('error')

    expect(withdrawEther(handler, amount)).rejects.toBe('error')
    expect(withdrawEtherMock).toBeCalledTimes(1)
  })
})

describe('withdrawToken()', () => {
  const amount = BigNumber.from('1000')

  it('should approve when success', () => {
    const handler = createHandler()

    withdrawToken(handler, amount)

    expect(withdrawTokenMock).toBeCalledTimes(1)
    expect(withdrawTokenMock.mock.calls[0][0]).toBe(TOKEN_ADDRESS)
    expect(withdrawTokenMock.mock.calls[0][1]).toEqual(amount)
  })

  it('should throw when error', () => {
    const handler = createHandler()
    withdrawTokenMock.mockRejectedValueOnce('error')

    expect(withdrawToken(handler, amount)).rejects.toBe('error')
    expect(withdrawTokenMock).toBeCalledTimes(1)
  })
})

describe('createOrder()', () => {
  describe('when buy', () => {
    const order: Order = {
      id: '1',
      type: TradeType.Buy,
      account: '0x1',
      amount: parseUnits('100').toString(),
      unitPrice: parseEther('0.01').toString(),
      totalPrice: parseEther('1').toString(),
      timestamp: new Date(timestamp.toString()),
    }

    it('should create order when success', () => {
      const handler = createHandler()

      createOrder(handler, order)

      expect(createOrderMock).toBeCalledTimes(1)
      expect(createOrderMock.mock.calls[0][0]).toEqual(ETHER_ADDRESS)
      expect(createOrderMock.mock.calls[0][1]).toEqual(order.totalPrice)
      expect(createOrderMock.mock.calls[0][2]).toEqual(TOKEN_ADDRESS)
      expect(createOrderMock.mock.calls[0][3]).toEqual(order.amount)
    })

    it('should throw error when error', () => {
      createOrderMock.mockRejectedValue('error')
      const handler = createHandler()

      expect(createOrder(handler, order)).rejects.toEqual('error')

      expect(createOrderMock).toBeCalledTimes(1)
    })
  })

  describe('when sell', () => {
    const order: Order = {
      id: '1',
      type: TradeType.Sell,
      account: '0x1',
      amount: parseUnits('100').toString(),
      unitPrice: parseEther('0.01').toString(),
      totalPrice: parseEther('1').toString(),
      timestamp: new Date(timestamp.toString()),
    }

    it('should create order when success', () => {
      const handler = createHandler()

      createOrder(handler, order)

      expect(createOrderMock).toBeCalledTimes(1)
      expect(createOrderMock.mock.calls[0][0]).toEqual(TOKEN_ADDRESS)
      expect(createOrderMock.mock.calls[0][1]).toEqual(order.amount)
      expect(createOrderMock.mock.calls[0][2]).toEqual(ETHER_ADDRESS)
      expect(createOrderMock.mock.calls[0][3]).toEqual(order.totalPrice)
    })

    it('should throw error when error', () => {
      createOrderMock.mockRejectedValue('error')
      const handler = createHandler()

      expect(createOrder(handler, order)).rejects.toEqual('error')

      expect(createOrderMock).toBeCalledTimes(1)
    })
  })
})
