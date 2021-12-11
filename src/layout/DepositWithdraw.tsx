import React, { FC, useContext } from 'react'
import { ExchangeContext } from './ExchangeContext'
import StyledDepositWithdraw from './DepositWithdraw.style'
import DepositWithdrawInput from 'components/DepositWithdrawInput'
import { BigNumber } from 'ethers'

const DepositWithdraw: FC = () => {
  const { depositEther, depositToken, getTokenAllowance, approveToken } = useContext(ExchangeContext)

  const isTokenDepositAllowed = async (amount: BigNumber) => {
    const allowance = await getTokenAllowance()

    return !!allowance?.gte(amount)
  }

  return (
    <StyledDepositWithdraw>
      <DepositWithdrawInput name="ETH" onDeposit={depositEther} />
      <DepositWithdrawInput
        name="TDX"
        isDepositAllowed={isTokenDepositAllowed}
        onDeposit={depositToken}
        onApprove={approveToken}
      />
    </StyledDepositWithdraw>
  )
}

export default DepositWithdraw
