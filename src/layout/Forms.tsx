import React, { FC, useContext, useEffect, useState } from 'react'
import DepositWithdrawInput from 'components/DepositWithdrawInput'
import { BigNumber, constants } from 'ethers'
import { ExchangeContext } from './ExchangeContext'
import StyledForms from './Forms.style'
import OrderForm from 'components/OrderForm'
import Card from 'react-bootstrap/Card'
import Order from 'models/Order'
import OrdersList from 'components/OrdersList'
import { MetaMaskContext } from './MetaMaskContext'
import Button from 'react-bootstrap/Button'

const { Zero } = constants

const Forms: FC = () => {
  const { account } = useContext(MetaMaskContext)
  const {
    depositEther,
    depositToken,
    withdrawEther,
    withdrawToken,
    getTokenAllowance,
    approveToken,
    cancelOrder,
    ethBalance,
    tokenBalance,
    orders,
  } = useContext(ExchangeContext)
  const [userOrders, setUserOrders] = useState<Order[]>([])

  const isTokenDepositAllowed = async (amount: BigNumber) => {
    const allowance = await getTokenAllowance()

    return !!allowance?.gte(amount)
  }

  const DeleteButton: FC<{ order: Order }> = ({ order }) => {
    return (
      <Button variant="outline-secondary" size="sm" onClick={() => cancelOrder(order.id as string)}>
        Cancel
      </Button>
    )
  }

  useEffect(() => {
    setUserOrders(orders.filter(({ account: orderAccount }) => orderAccount === account))
  }, [account, orders])

  return (
    <StyledForms>
      <DepositWithdrawInput
        name="ETH"
        onDeposit={depositEther}
        currentBalance={ethBalance ? BigNumber.from(ethBalance) : Zero}
        onWithdraw={withdrawEther}
      />
      <DepositWithdrawInput
        name="TDX"
        isDepositAllowed={isTokenDepositAllowed}
        currentBalance={tokenBalance ? BigNumber.from(tokenBalance) : Zero}
        onDeposit={depositToken}
        onWithdraw={withdrawToken}
        onApprove={approveToken}
      />
      <OrderForm />
      {!!userOrders.length && (
        <Card className="m-3 px-2 py-1">
          <OrdersList orders={userOrders} actions={[DeleteButton]} styleType />
        </Card>
      )}
    </StyledForms>
  )
}

export default Forms
