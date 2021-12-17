import { BigNumber, constants, Contract, providers } from 'ethers'
import { Web3Provider } from '@ethersproject/providers'
import orderBy from 'lodash/orderBy'
import Exchange from 'contracts/abis/Exchange.json'
import { Exchange as ExchangeType } from 'contracts/Exchange'
import { Token } from 'contracts/Token'
import { DECIMALS, getDateFromUnixTimestamp } from './helpers'
import Trade, { TradeType } from 'models/Trade'
import Order from 'models/Order'

const { AddressZero: ETHER_ADDRESS, Zero } = constants
export const TRADES_LIMIT = 20
export const ORDERS_LIMIT = 20

export interface ExchangeHandler {
  exchange: ExchangeType
  token: Token
  tradeListeners: (providers.Listener | null)[]
  createOrderListeners: (providers.Listener | null)[]
  cancelOrderListeners: (providers.Listener | null)[]
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
    createOrderListeners: [],
    cancelOrderListeners: [],
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
    callback(getTradeFromTradeEvent({ orderId, sellAmount, buyToken, buyAmount, timestamp }))
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

export const subscribeCreateOrders = (
  { exchange, createOrderListeners }: ExchangeHandler,
  callback: (order: Order) => void
): number => {
  const listener = (
    id: BigNumber,
    account: string,
    _sellToken: string,
    sellAmount: BigNumber,
    buyToken: string,
    buyAmount: BigNumber,
    timestamp: BigNumber
  ) => {
    callback(getOrderFromCreateOrderEvent({ id, account, sellAmount, buyToken, buyAmount, timestamp }))
  }

  exchange.on('CreateOrder', listener)
  createOrderListeners.push(listener)
  return createOrderListeners.indexOf(listener)
}

export const unsubscribeCreateOrders = ({ exchange, createOrderListeners }: ExchangeHandler, id: number): void => {
  const listener = createOrderListeners[id]
  if (!listener) {
    return
  }

  exchange.off('CreateOrder', listener)
  createOrderListeners[id] = null
}

export const subscribeCancelOrders = (
  { exchange, cancelOrderListeners }: ExchangeHandler,
  callback: (orderId: BigNumber) => void
): number => {
  const listener = (id: BigNumber) => {
    callback(id)
  }

  exchange.on('CancelOrder', listener)
  cancelOrderListeners.push(listener)
  return cancelOrderListeners.indexOf(listener)
}

export const unsubscribeCancelOrders = ({ exchange, cancelOrderListeners }: ExchangeHandler, id: number): void => {
  const listener = cancelOrderListeners[id]
  if (!listener) {
    return
  }

  exchange.off('CancelOrder', listener)
  cancelOrderListeners[id] = null
}

export const getAllTrades = async ({ exchange }: ExchangeHandler): Promise<Trade[]> => {
  const events = await exchange.queryFilter(exchange.filters.Trade())
  return orderBy(
    events.slice(-TRADES_LIMIT).map(({ args }) => getTradeFromTradeEvent(args)),
    ['timestamp'],
    ['desc']
  )
}

export const getPendingOrders = async ({ exchange }: ExchangeHandler): Promise<Order[]> => {
  const events = await exchange.queryFilter(exchange.filters.CreateOrder())
  const cancelledIds = (await exchange.queryFilter(exchange.filters.CancelOrder())).map(({ args }) => args.id)
  const filledIds = (await exchange.queryFilter(exchange.filters.Trade())).map(({ args }) => args.orderId)
  const orders: Order[] = []
  for (let index = events.length - 1; index >= 0; index--) {
    const { args } = events[index]
    if (!cancelledIds.find((id) => id.eq(args.id)) && !filledIds.find((id) => id.eq(args.id))) {
      orders.push(getOrderFromCreateOrderEvent(args))
      if (orders.length >= ORDERS_LIMIT) {
        break
      }
    }
  }

  return orders
}

export const getTokenAllowance = async ({ token, exchange }: ExchangeHandler, account: string): Promise<BigNumber> => {
  return await token.allowance(account, exchange.address)
}

export const approveToken = async ({ token, exchange }: ExchangeHandler, amount: BigNumber): Promise<void> => {
  await token.approve(exchange.address, amount)
}

export const depositEther = async ({ exchange }: ExchangeHandler, amount: BigNumber): Promise<void> => {
  await exchange.depositEther({ value: amount })
}

export const depositToken = async ({ exchange, token }: ExchangeHandler, amount: BigNumber): Promise<void> => {
  await exchange.depositToken(token.address, amount)
}

export const withdrawEther = async ({ exchange }: ExchangeHandler, amount: BigNumber): Promise<void> => {
  await exchange.withdrawEther(amount)
}

export const withdrawToken = async ({ token, exchange }: ExchangeHandler, amount: BigNumber): Promise<void> => {
  await exchange.withdrawToken(token.address, amount)
}

const getTradeFromTradeEvent = ({
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

const getOrderFromCreateOrderEvent = ({
  id,
  account,
  sellAmount,
  buyToken,
  buyAmount,
  timestamp,
}: {
  id: BigNumber
  account: string
  sellAmount: BigNumber
  buyToken: string
  buyAmount: BigNumber
  timestamp: BigNumber
}): Order => {
  const type = getTradeType(buyToken)
  const totalPrice = type == TradeType.Buy ? sellAmount : buyAmount // 0.001
  const tokenAmount = type == TradeType.Buy ? buyAmount : sellAmount // 0.1
  const unitPrice = tokenAmount.isZero() ? Zero : totalPrice.mul(BigNumber.from(10).pow(DECIMALS)).div(tokenAmount)

  return {
    orderId: id.toString(),
    timestamp: getDateFromUnixTimestamp(timestamp),
    type,
    account,
    amount: tokenAmount.toString(),
    unitPrice: unitPrice.toString(),
    totalPrice: totalPrice.toString(),
  }
}

const getTradeType = (buyToken: string) => {
  return buyToken == ETHER_ADDRESS ? TradeType.Sell : TradeType.Buy
}
