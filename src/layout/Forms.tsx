import React, { FC, useContext } from 'react'
import DepositWithdrawInput from 'components/DepositWithdrawInput'
import { BigNumber, constants } from 'ethers'
import { ExchangeContext } from './ExchangeContext'
import StyledForms from './Forms.style'
import OrderForm from 'components/OrderForm'

const { Zero } = constants

const Forms: FC = () => {
  const {
    depositEther,
    depositToken,
    withdrawEther,
    withdrawToken,
    getTokenAllowance,
    approveToken,
    ethBalance,
    tokenBalance,
  } = useContext(ExchangeContext)

  const isTokenDepositAllowed = async (amount: BigNumber) => {
    const allowance = await getTokenAllowance()

    return !!allowance?.gte(amount)
  }

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
    </StyledForms>
  )
}

export default Forms
