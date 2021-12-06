import { BigNumber, ethers } from 'ethers'
import { Web3Provider } from '@ethersproject/providers'
import Exchange from 'contracts/abis/Exchange.json'
import { Exchange as ExchangeType } from 'contracts/Exchange'
import { Token } from 'contracts/Token'

export interface ExchangeHandler {
  provider: Web3Provider
  exchange: ExchangeType | undefined
  token: Token
}

export const initializeContract = (provider: Web3Provider, token: Token): ExchangeHandler | undefined => {
  const exchangeAddress = process.env.REACT_APP_EXCHANGE_CONTRACT_ADDRESS
  if (!exchangeAddress) {
    return
  }

  const exchange = new ethers.Contract(exchangeAddress, Exchange.abi, provider.getSigner()) as ExchangeType

  return {
    provider,
    exchange,
    token,
  }
}

export const getEthBalance = async (handler: ExchangeHandler, account: string): Promise<BigNumber | undefined> => {
  try {
    return (await handler.exchange?.ethBalanceOf(account)) as BigNumber
  } catch (error) {
    return
  }
}

export const getTokenBalance = async (handler: ExchangeHandler, account: string): Promise<BigNumber | undefined> => {
  try {
    return (await handler.exchange?.tokenBalanceOf(handler.token.address, account)) as BigNumber
  } catch {
    return
  }
}
