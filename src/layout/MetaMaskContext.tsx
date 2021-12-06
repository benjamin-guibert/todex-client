import { createContext, useRef, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { MetaMaskHandler, initialize, connect, getAccount, getBalance } from 'libraries/metamask'

export enum InitializationStatus {
  None = 0,
  Initializing = 1,
  Initialized = 2,
  NotInstalled = 3,
  Error = 4,
}

export interface MetaMaskContextValue {
  initializationStatus: InitializationStatus
  account: string | undefined
  balance: string | undefined
  initialize: () => Promise<Web3Provider | undefined>
  connect: () => Promise<string | undefined>
  getAccount: () => Promise<string | undefined>
  getBalance: (account: string) => Promise<string | undefined>
}

export const useMetaMaskContext = (): MetaMaskContextValue => {
  const metaMaskHandlerRef = useRef<MetaMaskHandler>()
  const [initializationStatus, setInitializationStatus] = useState<InitializationStatus>(InitializationStatus.None)
  const [account, setAccount] = useState<string | undefined>()
  const [balance, setBalance] = useState<string | undefined>()

  const initializeValue = async () => {
    try {
      metaMaskHandlerRef.current = await initialize()
      if (!metaMaskHandlerRef.current) {
        setInitializationStatus(InitializationStatus.NotInstalled)
      }

      setInitializationStatus(InitializationStatus.Initialized)

      getAccountValue()
    } catch {
      setInitializationStatus(InitializationStatus.Error)
    }

    return metaMaskHandlerRef.current?.provider
  }

  const connectValue = async () => {
    if (!metaMaskHandlerRef.current) {
      return undefined
    }

    const account = await connect(metaMaskHandlerRef.current)
    setAccount(account)

    return account
  }

  const getAccountValue = async () => {
    if (!metaMaskHandlerRef.current) {
      return undefined
    }

    const account = await getAccount(metaMaskHandlerRef.current)
    setAccount(account)

    return account
  }

  const getBalanceValue = async (account: string) => {
    if (!metaMaskHandlerRef.current) {
      return undefined
    }

    const balance = (await getBalance(metaMaskHandlerRef.current, account))?.toString()

    setBalance(balance)

    return balance
  }

  return {
    initializationStatus,
    account,
    balance,
    initialize: initializeValue,
    connect: connectValue,
    getAccount: getAccountValue,
    getBalance: getBalanceValue,
  }
}

export const MetaMaskContext = createContext<MetaMaskContextValue>({
  initializationStatus: InitializationStatus.None,
  account: undefined,
  balance: undefined,
  initialize: async () => undefined,
  connect: async () => undefined,
  getAccount: async () => undefined,
  getBalance: async () => undefined,
})
