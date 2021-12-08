import { BigNumber } from '@ethersproject/bignumber'
import { getDateFromUnixTimestamp } from './helpers'

describe('getDateFromUnixTimestamp()', () => {
  it('should return date', () => {
    const timestamp = BigNumber.from('1612345678')

    const result = getDateFromUnixTimestamp(timestamp)

    expect(result).toEqual(new Date('2021-02-03T09:47:58.000Z'))
  })
})
