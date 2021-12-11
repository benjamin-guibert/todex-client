import React, { FC, useContext } from 'react'
import { ExchangeContext } from './ExchangeContext'
import StyledDepositWithdraw from './DepositWithdraw.style'
import DepositWithdrawInput from 'components/DepositWithdrawInput'
import { BigNumber } from 'ethers'
import { constants } from 'ethers'

const { Zero } = constants

const DepositWithdraw: FC = () => {
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
    <StyledDepositWithdraw>
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
    </StyledDepositWithdraw>
  )
}

export default DepositWithdraw
