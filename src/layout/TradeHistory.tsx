import React, { FC, useContext } from 'react'
import moment from 'moment'
import { printAmount } from 'libraries/helpers'
import { ExchangeContext } from './ExchangeContext'
import Table from 'react-bootstrap/Table'
import StyledTradeHistory from './TradeHistory.style'
import { TradeType } from 'models/Trade'
import { MetaMaskContext } from './MetaMaskContext'

const TradeHistory: FC = () => {
  const { account } = useContext(MetaMaskContext)
  const { trades } = useContext(ExchangeContext)

  return (
    <StyledTradeHistory>
      <Table variant="dark">
        <thead>
          <tr className="text-center">
            <th>Time</th>
            <th>Amount</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {trades.map(({ orderId, type, sellAccount, buyAccount, amount, unitPrice, totalPrice, timestamp }) => {
            return (
              <tr
                key={orderId}
                className={[
                  'font-monospace',
                  `text-${type == TradeType.Buy ? 'success' : 'danger'}`,
                  sellAccount === account || buyAccount === account ? 'fw-bold' : '',
                ].join(' ')}
              >
                <td className="text-center text-muted">{moment(timestamp).format('HH:mm')}</td>
                <td className="text-end">{`${type == TradeType.Buy ? '+' : '-'}${printAmount(amount)}`}</td>
                <td className="text-end">{printAmount(unitPrice, { maxDecimals: 5 })}</td>
                <td className="text-end">{printAmount(totalPrice)}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </StyledTradeHistory>
  )
}

export default TradeHistory
