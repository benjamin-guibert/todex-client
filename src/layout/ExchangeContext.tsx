import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { Token } from 'contracts/Token'
import { ExchangeHandler, getEthBalance, getTokenBalance, initializeContract } from 'libraries/contracts/exchange'

export interface ExchangeContextValue {
  initialized: boolean
  ethBalance: string | undefined
  tokenBalance: string | undefined
  initialize: (provider: Web3Provider, token: Token) => Promise<boolean>
  setAccount: (account: string | undefined) => void
  updateBalances: () => Promise<void>
}

export const useExchangeContext = (): ExchangeContextValue => {
  const exchangeHandlerRef = useRef<ExchangeHandler>()
  const [initialized, setInitialized] = useState<boolean>(false)
  const [ethBalance, setEthBalance] = useState<string | undefined>()
  const [account, setAccount] = useState<string | undefined>()
  const [tokenBalance, setTokenBalance] = useState<string | undefined>()

  const initializeValue = async (provider: Web3Provider, token: Token) => {
    exchangeHandlerRef.current = initializeContract(provider, token)
    setInitialized(!!exchangeHandlerRef.current)

    return !!exchangeHandlerRef.current
  }

  const updateBalancesValue = useCallback(async () => {
    if (!exchangeHandlerRef.current || !account) {
      return
    }
    setEthBalance((await getEthBalance(exchangeHandlerRef.current, account))?.toString())
    setTokenBalance((await getTokenBalance(exchangeHandlerRef.current, account))?.toString())
  }, [account])

  const setAccountValue = (account: string | undefined) => {
    setAccount(account)
  }

  useEffect(() => {
    updateBalancesValue()
  }, [updateBalancesValue, account])

  return {
    initialized,
    ethBalance,
    tokenBalance,
    initialize: initializeValue,
    setAccount: setAccountValue,
    updateBalances: updateBalancesValue,
  }
}

export const ExchangeContext = createContext<ExchangeContextValue>({
  initialized: false,
  ethBalance: undefined,
  tokenBalance: undefined,
  initialize: async () => false,
  setAccount: () => undefined,
  updateBalances: async () => undefined,
})
