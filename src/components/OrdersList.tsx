import React, { FC, useContext } from 'react'
import { printAmount } from 'libraries/helpers'
import Order from 'models/Order'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import { MetaMaskContext } from 'layout/MetaMaskContext'

interface OrdersListProps {
  variant: 'success' | 'danger'
  orders: Order[]
  className?: string
}

const OrdersList: FC<OrdersListProps> = ({ variant, className, orders }) => {
  const { account: userAccount } = useContext(MetaMaskContext)

  return (
    <Container className={className}>
      <Table variant={variant}>
        <thead>
          <tr className="text-center">
            <th>Amount</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(({ id, account, amount, unitPrice, totalPrice }) => {
            return (
              <tr className={['font-monospace text-end', account === userAccount ? 'fw-bold' : ''].join(' ')} key={id}>
                <td>{printAmount(amount)}</td>
                <td>{printAmount(unitPrice as string)}</td>
                <td>{printAmount(totalPrice)}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </Container>
  )
}

export default OrdersList
