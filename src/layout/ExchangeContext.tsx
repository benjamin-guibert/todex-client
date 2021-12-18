import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import { Token } from 'contracts/Token'
import uniqBy from 'lodash/uniqBy'
import filter from 'lodash/filter'
import Trade from 'models/Trade'
import Order from 'models/Order'
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
  ORDERS_LIMIT,
  subscribeCancelOrders,
  subscribeCreateOrders,
  subscribeTrades,
  TRADES_LIMIT,
  unsubscribeCancelOrders,
  unsubscribeCreateOrders,
  unsubscribeTrades,
  withdrawEther,
  withdrawToken,
} from 'libraries/contracts/exchange'

export interface ExchangeContextValue {
  initialized: boolean
  ethBalance: string | undefined
  tokenBalance: string | undefined
  trades: Trade[]
  orders: Order[]
  initialize: (provider: Web3Provider, token: Token) => Promise<boolean>
  setAccount: (account: string | null | undefined) => void
  updateBalances: () => Promise<void>
  getTokenAllowance: () => Promise<BigNumber | undefined>
  approveToken: (amount: BigNumber) => Promise<void>
  depositEther: (amount: BigNumber) => Promise<void>
  depositToken: (amount: BigNumber) => Promise<void>
  withdrawEther: (amount: BigNumber) => Promise<void>
  withdrawToken: (amount: BigNumber) => Promise<void>
  createOrder: (order: Order) => Promise<void>
}

export const useExchangeContext = (): ExchangeContextValue => {
  const exchangeHandlerRef = useRef<ExchangeHandler>()
  const [initialized, setInitialized] = useState<boolean>(false)
  const [ethBalance, setEthBalance] = useState<string | undefined>()
  const [account, setAccount] = useState<string | null | undefined>()
  const [tokenBalance, setTokenBalance] = useState<string | undefined>()
  const [tradeListener, setTradeListener] = useState<number>()
  const [createOrderListener, setCreateOrderListener] = useState<number>()
  const [cancelOrderListener, setCancelOrderListener] = useState<number>()
  const [trades, setTrades] = useState<Trade[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  const initializeValue = async (provider: Web3Provider, token: Token) => {
    try {
      exchangeHandlerRef.current = initializeContract(provider, token)
      setInitialized(!!exchangeHandlerRef.current)

      await initializeTrades()
      await initializeOrders()
      return true
    } catch {
      setInitialized(false)
      return false
    }
  }

  const initializeTrades = async () => {
    if (!exchangeHandlerRef.current) {
      return
    }

    setTrades((await getAllTrades(exchangeHandlerRef.current)) || [])
    setTradeListener(subscribeTrades(exchangeHandlerRef.current, addTrade))
  }

  const initializeOrders = async () => {
    if (!exchangeHandlerRef.current) {
      return
    }

    setOrders((await getPendingOrders(exchangeHandlerRef.current)) || [])
    setCreateOrderListener(subscribeCreateOrders(exchangeHandlerRef.current, addOrder))
    setCancelOrderListener(subscribeCancelOrders(exchangeHandlerRef.current, removeOrder))
  }

  const setAccountValue = (account: string | null | undefined) => {
    setAccount(account)
  }

  useEffect(() => {
    return () => {
      if (!exchangeHandlerRef.current) {
        return
      }
      if (tradeListener) {
        unsubscribeTrades(exchangeHandlerRef.current, tradeListener)
      }
      if (createOrderListener) {
        unsubscribeCreateOrders(exchangeHandlerRef.current, createOrderListener)
      }
      if (cancelOrderListener) {
        unsubscribeCancelOrders(exchangeHandlerRef.current, cancelOrderListener)
      }
    }
  }, [cancelOrderListener, createOrderListener, tradeListener])

  const updateBalancesValue = useCallback(async () => {
    if (!exchangeHandlerRef.current || !account) {
      return
    }

    try {
      setEthBalance((await getEthBalance(exchangeHandlerRef.current, account))?.toString())
      setTokenBalance((await getTokenBalance(exchangeHandlerRef.current, account))?.toString())
    } catch (error) {
      setEthBalance(undefined)
      setTokenBalance(undefined)
    }
  }, [account])

  const getTokenAllowanceValue = async () => {
    if (!exchangeHandlerRef.current || !account) {
      return
    }

    try {
      return getTokenAllowance(exchangeHandlerRef.current, account)
    } catch {
      return
    }
  }

  const approveTokenValue = async (amount: BigNumber) => {
    if (!exchangeHandlerRef.current) {
      return
    }

    await approveToken(exchangeHandlerRef.current, amount)
  }

  const depositEtherValue = async (amount: BigNumber) => {
    if (!exchangeHandlerRef.current) {
      return
    }

    await depositEther(exchangeHandlerRef.current, amount)
  }

  const depositTokenValue = async (amount: BigNumber) => {
    if (!exchangeHandlerRef.current) {
      return
    }

    await depositToken(exchangeHandlerRef.current, amount)
  }

  const withdrawEtherValue = async (amount: BigNumber) => {
    if (!exchangeHandlerRef.current) {
      return
    }

    await withdrawEther(exchangeHandlerRef.current, amount)
  }

  const withdrawTokenValue = async (amount: BigNumber) => {
    if (!exchangeHandlerRef.current) {
      return
    }

    await withdrawToken(exchangeHandlerRef.current, amount)
  }

  const createOrderValue = async (order: Order) => {
    if (!exchangeHandlerRef.current) {
      return
    }

    await createOrder(exchangeHandlerRef.current, order)
  }

  const addTrade = (trade: Trade) => {
    setTrades((trades) => uniqBy([trade, ...trades], 'orderId').slice(0, TRADES_LIMIT - 1))
    setOrders((orders) => filter(orders, ({ id }) => trade.orderId != id))
  }

  const addOrder = (order: Order) => {
    setOrders((orders) => uniqBy([order, ...orders], 'id').slice(0, ORDERS_LIMIT - 1))
  }

  const removeOrder = (id: BigNumber) => {
    setOrders((orders) => filter(orders, ({ id: orderId }) => !id.eq(orderId as string)))
  }

  useEffect(() => {
    updateBalancesValue()
  }, [updateBalancesValue, account])

  return {
    initialized,
    ethBalance,
    tokenBalance,
    trades,
    orders,
    initialize: initializeValue,
    setAccount: setAccountValue,
    updateBalances: updateBalancesValue,
    getTokenAllowance: getTokenAllowanceValue,
    approveToken: approveTokenValue,
    depositEther: depositEtherValue,
    depositToken: depositTokenValue,
    withdrawEther: withdrawEtherValue,
    withdrawToken: withdrawTokenValue,
    createOrder: createOrderValue,
  }
}

export const ExchangeContext = createContext<ExchangeContextValue>({
  initialized: false,
  ethBalance: undefined,
  tokenBalance: undefined,
  trades: [],
  orders: [],
  initialize: async () => false,
  setAccount: () => undefined,
  updateBalances: async () => undefined,
  getTokenAllowance: async () => undefined,
  approveToken: async () => undefined,
  depositEther: async () => undefined,
  depositToken: async () => undefined,
  withdrawEther: async () => undefined,
  withdrawToken: async () => undefined,
  createOrder: async () => undefined,
})
