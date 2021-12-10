import detectEthereumProvider from '@metamask/detect-provider'
import { BigNumber, ethers } from 'ethers'
import { ExternalProvider, Web3Provider } from '@ethersproject/providers'

export interface MetaMaskHandler {
  provider: Web3Provider
}

export const initialize = async (): Promise<MetaMaskHandler | undefined> => {
  const detectedProvider = (await detectEthereumProvider()) as ExternalProvider
  if (!detectedProvider) {
    return
  }

  const provider = new ethers.providers.Web3Provider(detectedProvider)

  return {
    provider,
  }
}

export const connect = async (handler: MetaMaskHandler): Promise<string | null> => {
  await handler.provider.send('eth_requestAccounts', [])

  return getAccount(handler)
}

export const getAccount = async ({ provider }: MetaMaskHandler): Promise<string | null> => {
  try {
    return await provider.getSigner().getAddress()
  } catch {
    return null
  }
}

export const getBalance = async ({ provider }: MetaMaskHandler, account: string): Promise<BigNumber | undefined> => {
  return await provider.getBalance(account)
}
