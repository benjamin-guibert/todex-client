import React, { FC, useContext } from 'react'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'
import { ExchangeContext } from './ExchangeContext'
import { BuyOrdersList, SellOrdersList } from './Orders.style'
import { TradeType } from 'models/Trade'

const Orders: FC = () => {
  const { orders } = useContext(ExchangeContext)
  const sellOrder = orderBy(
    filter(orders, ({ type }) => type == TradeType.Sell),
    ['unitPrice'],
    ['desc']
  )
  const buyOrder = orderBy(
    filter(orders, ({ type }) => type == TradeType.Buy),
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
