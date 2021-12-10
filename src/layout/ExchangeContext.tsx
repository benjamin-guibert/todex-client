import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { Token } from 'contracts/Token'
import {
  ExchangeHandler,
  getAllTrades,
  getEthBalance,
  getTokenBalance,
  initializeContract,
  subscribeTrades,
  Trade,
  TRADES_LIMIT,
  unsubscribeTrades,
} from 'libraries/contracts/exchange'
import { uniqBy } from 'lodash'

export interface ExchangeContextValue {
  initialized: boolean
  ethBalance: string | undefined
  tokenBalance: string | undefined
  trades: Trade[]
  initialize: (provider: Web3Provider, token: Token) => Promise<boolean>
  setAccount: (account: string | null | undefined) => void
  updateBalances: () => Promise<void>
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
})
