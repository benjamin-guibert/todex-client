import React, { FC, useContext } from 'react'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'
import { ExchangeContext } from './ExchangeContext'
import { BuyOrdersList, SellOrdersList } from './Orders.style'
import { TradeType } from 'models/Trade'
import { MetaMaskContext } from './MetaMaskContext'

const Orders: FC = () => {
  const { account } = useContext(MetaMaskContext)
  const { orders } = useContext(ExchangeContext)
  const sellOrder = orderBy(
    filter(orders, ({ type, account: orderAccount }) => type == TradeType.Sell && orderAccount !== account),
    ['unitPrice'],
    ['desc']
  )
  const buyOrder = orderBy(
    filter(orders, ({ type, account: orderAccount }) => type == TradeType.Buy && orderAccount !== account),
    ['unitPrice'],
    ['desc']
  )

  return (
    <>
      <SellOrdersList orders={sellOrder} variant="danger" />
      <BuyOrdersList orders={buyOrder} variant="success" />
    </>
  )
}

export default Orders
