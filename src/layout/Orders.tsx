import React, { FC, useContext } from 'react'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'
import { ExchangeContext } from './ExchangeContext'
import { BuyOrdersList, SellOrdersList } from './Orders.style'
import { TradeType } from 'models/Trade'
import { MetaMaskContext } from './MetaMaskContext'
import Button from 'react-bootstrap/esm/Button'
import Order from 'models/Order'
import { BigNumber } from 'ethers'

const Orders: FC = () => {
  const { account } = useContext(MetaMaskContext)
  const { orders, ethBalance, tokenBalance, fillOrder } = useContext(ExchangeContext)
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

  const BuyButton: FC<{ order: Order }> = ({ order }) => {
    const { id, totalPrice } = order

    return (
      <Button
        size="sm"
        variant="danger"
        disabled={!ethBalance || BigNumber.from(totalPrice).gte(BigNumber.from(ethBalance))}
        onClick={() => fillOrder(id as string)}
      >
        Buy
      </Button>
    )
  }

  const SellButton: FC<{ order: Order }> = ({ order }) => {
    const { id, amount } = order

    return (
      <Button
        size="sm"
        variant="success"
        disabled={!tokenBalance || BigNumber.from(amount).gte(BigNumber.from(tokenBalance))}
        onClick={() => fillOrder(id as string)}
      >
        Sell
      </Button>
    )
  }

  return (
    <>
      <SellOrdersList orders={sellOrder} variant="danger" actions={[BuyButton]} />
      <BuyOrdersList orders={buyOrder} variant="success" actions={[SellButton]} />
    </>
  )
}

export default Orders
