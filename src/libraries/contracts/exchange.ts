import { BigNumber, constants, Contract, providers } from 'ethers'
import { Web3Provider } from '@ethersproject/providers'
import orderBy from 'lodash/orderBy'
import Exchange from 'contracts/abis/Exchange.json'
import { Exchange as ExchangeType } from 'contracts/Exchange'
import { Token } from 'contracts/Token'
import { DECIMALS, getDateFromUnixTimestamp } from './helpers'

const { AddressZero, Zero } = constants
const ETHER_ADDRESS = AddressZero

export enum TradeType {
  Sell = 0,
  Buy = 1,
}

export enum TokenType {
  Unknown = 0,
  Ether = 1,
  ToDEX = 2,
}

export interface Trade {
  orderId: string
  timestamp: Date
  type: TradeType
  amount: string
  unitPrice: string
  totalPrice: string
}

export interface ExchangeHandler {
  exchange: ExchangeType
  token: Token
  tradeListeners: (providers.Listener | null)[]
}

export const initializeContract = (provider: Web3Provider, token: Token): ExchangeHandler => {
  const exchangeAddress = process.env.REACT_APP_EXCHANGE_CONTRACT_ADDRESS
  if (!exchangeAddress) {
    throw 'Exchange address missing'
  }

  const exchange = new Contract(exchangeAddress, Exchange.abi, provider.getSigner()) as ExchangeType

  return {
    exchange,
    token,
    tradeListeners: [],
  }
}

export const getEthBalance = async ({ exchange }: ExchangeHandler, account: string): Promise<BigNumber> => {
  return (await exchange.ethBalanceOf(account)) as BigNumber
}

export const getTokenBalance = async ({ exchange, token }: ExchangeHandler, account: string): Promise<BigNumber> => {
  return (await exchange.tokenBalanceOf(token.address, account)) as BigNumber
}

export const subscribeTrades = (
  { exchange, tradeListeners }: ExchangeHandler,
  callback: (trade: Trade) => void
): number => {
  const listener = (
    orderId: BigNumber,
    _sellAccount: string,
    _sellToken: string,
    sellAmount: BigNumber,
    _buyAccount: string,
    buyToken: string,
    buyAmount: BigNumber,
    timestamp: BigNumber
  ) => {
    callback(getTradeFromEvent({ orderId, sellAmount, buyToken, buyAmount, timestamp }))
  }

  exchange.on('Trade', listener)
  tradeListeners.push(listener)
  return tradeListeners.indexOf(listener)
}

export const unsubscribeTrades = ({ exchange, tradeListeners }: ExchangeHandler, id: number): void => {
  const listener = tradeListeners[id]
  if (!listener) {
    return
  }

  exchange.off('Trade', listener)
  tradeListeners[id] = null
}

export const getAllTrades = async ({ exchange }: ExchangeHandler): Promise<Trade[]> => {
  const events = await exchange.queryFilter(exchange.filters.Trade())
  return orderBy(
    events.map(({ args }) => getTradeFromEvent(args)),
    ['timestamp'],
    ['desc']
  )
}

const getTradeFromEvent = ({
  orderId,
  sellAmount,
  buyToken,
  buyAmount,
  timestamp,
}: {
  orderId: BigNumber
  sellAmount: BigNumber
  buyToken: string
  buyAmount: BigNumber
  timestamp: BigNumber
}): Trade => {
  const type = getTradeType(buyToken)
  const totalPrice = type == TradeType.Buy ? sellAmount : buyAmount // 0.001
  const tokenAmount = type == TradeType.Buy ? buyAmount : sellAmount // 0.1
  const unitPrice = tokenAmount.isZero() ? Zero : totalPrice.mul(BigNumber.from(10).pow(DECIMALS)).div(tokenAmount)

  return {
    orderId: orderId.toString(),
    timestamp: getDateFromUnixTimestamp(timestamp),
    type,
    amount: tokenAmount.toString(),
    unitPrice: unitPrice.toString(),
    totalPrice: totalPrice.toString(),
  }
}

// const getTokenType = (address: string) => {
//   switch (address) {
//     case ETHER_ADDRESS:
//       return TokenType.Ether
//     case getTokenAddress():
//       return TokenType.ToDEX
//     default:
//       return TokenType.Unknown
//   }
// }

const getTradeType = (buyToken: string) => {
  return buyToken == ETHER_ADDRESS ? TradeType.Sell : TradeType.Buy
}
