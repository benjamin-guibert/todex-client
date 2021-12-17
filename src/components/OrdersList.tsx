import React, { FC } from 'react'
import { printAmount } from 'libraries/helpers'
import Order from 'models/Order'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'

interface OrdersListProps {
  variant: 'success' | 'danger'
  orders: Order[]
  className?: string
}

const OrdersList: FC<OrdersListProps> = ({ variant, className, orders }) => {
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
          {orders.map(({ orderId, amount, unitPrice, totalPrice }) => {
            return (
              <tr className="font-monospace text-end" key={orderId}>
                <td>{printAmount(amount)}</td>
                <td>{printAmount(unitPrice)}</td>
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
