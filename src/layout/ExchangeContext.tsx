import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { Token } from 'contracts/Token'
import {
  approveToken,
  depositEther,
  depositToken,
  ExchangeHandler,
  getAllTrades,
  getEthBalance,
  getTokenAllowance,
  getTokenBalance,
  initializeContract,
  subscribeTrades,
  Trade,
  TRADES_LIMIT,
  unsubscribeTrades,
  withdrawEther,
  withdrawToken,
} from 'libraries/contracts/exchange'
import uniqBy from 'lodash/uniqBy'
import { BigNumber } from 'ethers'

export interface ExchangeContextValue {
  initialized: boolean
  ethBalance: string | undefined
  tokenBalance: string | undefined
  trades: Trade[]
  initialize: (provider: Web3Provider, token: Token) => Promise<boolean>
  setAccount: (account: string | null | undefined) => void
  updateBalances: () => Promise<void>
  getTokenAllowance: () => Promise<BigNumber | undefined>
  approveToken: (amount: BigNumber) => Promise<void>
  depositEther: (amount: BigNumber) => Promise<void>
  depositToken: (amount: BigNumber) => Promise<void>
  withdrawEther: (amount: BigNumber) => Promise<void>
  withdrawToken: (amount: BigNumber) => Promise<void>
}

export const useExchangeContext = (): ExchangeContextValue => {
  const exchangeHandlerRef = useRef<ExchangeHandler>()
  const [initialized, setInitialized] = useState<boolean>(false)
  const [ethBalance, setEthBalance] = useState<string | undefined>()
  const [account, setAccount] = useState<string | null | undefined>()
  const [tokenBalance, setTokenBalance] = useState<string | undefined>()
  const [tradeListener, setTradeListener] = useState<number>()
  const [trades, setTrades] = useState<Trade[]>([])

  const addTrade = (trade: Trade) => {
    setTrades((trades) => uniqBy([trade, ...trades].slice(0, TRADES_LIMIT - 1), 'orderId'))
  }

  const initializeValue = async (provider: Web3Provider, token: Token) => {
    try {
      exchangeHandlerRef.current = initializeContract(provider, token)
      setInitialized(!!exchangeHandlerRef.current)

      setTrades((await getAllTrades(exchangeHandlerRef.current)) || [])
      const tradeListener = subscribeTrades(exchangeHandlerRef.current, addTrade)
      setTradeListener(tradeListener)
      return true
    } catch {
      setInitialized(false)
      return false
    }
  }

  const setAccountValue = (account: string | null | undefined) => {
    setAccount(account)
  }

  useEffect(() => {
    return () => {
      if (!exchangeHandlerRef.current || !tradeListener) {
        return
      }
      unsubscribeTrades(exchangeHandlerRef.current, tradeListener)
    }
  }, [tradeListener])

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

  useEffect(() => {
    updateBalancesValue()
  }, [updateBalancesValue, account])

  return {
    initialized,
    ethBalance,
    tokenBalance,
    trades,
    initialize: initializeValue,
    setAccount: setAccountValue,
    updateBalances: updateBalancesValue,
    getTokenAllowance: getTokenAllowanceValue,
    approveToken: approveTokenValue,
    depositEther: depositEtherValue,
    depositToken: depositTokenValue,
    withdrawEther: withdrawEtherValue,
    withdrawToken: withdrawTokenValue,
  }
}

export const ExchangeContext = createContext<ExchangeContextValue>({
  initialized: false,
  ethBalance: undefined,
  tokenBalance: undefined,
  trades: [],
  initialize: async () => false,
  setAccount: () => undefined,
  updateBalances: async () => undefined,
  getTokenAllowance: async () => undefined,
  approveToken: async () => undefined,
  depositEther: async () => undefined,
  depositToken: async () => undefined,
  withdrawEther: async () => undefined,
  withdrawToken: async () => undefined,
})
