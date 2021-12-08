import { ethers } from 'ethers'
import { Web3Provider } from '@ethersproject/providers'
import Token from 'contracts/abis/Token.json'
import { Token as TokenType } from 'contracts/Token'

export interface TokenHandler {
  provider: Web3Provider
  token: TokenType
}

export const initializeContract = (provider: Web3Provider): TokenHandler => {
  const tokenAddress = process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS
  if (!tokenAddress) {
    throw new Error('Token address missing')
  }

  const token = new ethers.Contract(tokenAddress, Token.abi, provider.getSigner()) as TokenType

  return {
    provider,
    token,
  }
}
