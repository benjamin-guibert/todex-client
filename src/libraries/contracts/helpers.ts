import { BigNumber } from '@ethersproject/bignumber'

export const BURN_ADDRESS = '0x0000000000000000000000000000000000000000'
export const DECIMALS = 18

export const getDateFromUnixTimestamp = (timestamp: BigNumber) => {
  return new Date(timestamp.mul(1000).toNumber())
}
