import React, { FC } from 'react'
import { printAmount } from 'libraries/helpers'
import Order from 'models/Order'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import { TradeType } from 'models/Trade'

interface OrdersListProps {
  orders: Order[]
  variant?: 'success' | 'danger'
  className?: string
  actions?: FC<{ orderId: string }>[]
  styleType?: boolean
}

const OrdersList: FC<OrdersListProps> = ({ variant, className, orders, actions, styleType }) => {
  return (
    <Container className={className}>
      <Table variant={variant}>
        <thead>
          <tr className="text-center">
            <th>Amount</th>
            <th>Price</th>
            <th>Total</th>
            {!!actions?.length && <td></td>}
          </tr>
        </thead>
        <tbody>
          {orders.map(({ id, type, amount, unitPrice, totalPrice }) => {
            return (
              <tr
                className={[
                  'font-monospace text-end',
                  styleType ? `text-${type == TradeType.Buy ? 'success' : 'danger'}` : '',
                ].join(' ')}
                key={id}
              >
                <td>{printAmount(amount)}</td>
                <td>{printAmount(unitPrice as string)}</td>
                <td>{printAmount(totalPrice)}</td>
                {!!actions?.length && (
                  <td>
                    {actions.map((Action, i) => (
                      <Action key={`id-${i}`} orderId={id as string} />
                    ))}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </Table>
    </Container>
  )
}

export default OrdersList
