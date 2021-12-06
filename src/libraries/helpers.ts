import { BigNumber, ethers } from 'ethers'
import numeral from 'numeral'

const DEFAULT_DECIMALS = 18
const MAX_DECIMALS = 13

export interface AmountPrintOptions {
  decimals?: number
  forceDecimals?: boolean
  maxDecimals?: number
}

export const printFormatedAmount = (amount: string | null, options?: AmountPrintOptions | null): string => {
  const { decimals, forceDecimals, maxDecimals } = options ?? {}
  const decimalsCount = Math.min(decimals || DEFAULT_DECIMALS, maxDecimals || MAX_DECIMALS, MAX_DECIMALS)
  const decimalFormat = forceDecimals ? '0'.repeat(decimalsCount) : `[${'0'.repeat(decimalsCount)}]`

  return amount ? numeral(amount).format(`0,0.${decimalFormat}`) : ''
}

export const printAmount = (amount: BigNumber | string | null, options?: AmountPrintOptions | null): string => {
  if (!amount) {
    return ''
  }

  return printFormatedAmount(ethers.utils.formatUnits(BigNumber.from(amount), options?.decimals), options)
}

export const shortenAddress = (address: string): string => {
  const start = address.substring(0, 6)
  const end = address.substring(address.length - 4)

  return `${start}...${end}`
}
