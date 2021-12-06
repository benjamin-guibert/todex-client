import { BigNumber } from 'ethers'
import { printAmount, printFormatedAmount, shortenAddress } from './helpers'

describe('printFormatedAmount()', () => {
  const amount = '1234.56789'

  it('should return when default decimals', () => {
    const result = printFormatedAmount(amount)

    expect(result).toBe('1,234.56789')
  })

  it('should return when decimals under default', () => {
    const result = printFormatedAmount(amount, { maxDecimals: 4 })

    expect(result).toBe('1,234.5679')
  })

  it('should return when decimals above default', () => {
    const result = printFormatedAmount(amount, { maxDecimals: 15 })

    expect(result).toBe('1,234.56789')
  })

  describe('when forced decimals', () => {
    it('should return when default decimals', () => {
      const result = printFormatedAmount(amount, { forceDecimals: true })

      expect(result).toBe('1,234.5678900000000')
    })

    it('should return when decimals under default', () => {
      const result = printFormatedAmount(amount, { maxDecimals: 4, forceDecimals: true })

      expect(result).toBe('1,234.5679')
    })

    it('should return when decimals above default', () => {
      const result = printFormatedAmount(amount, { maxDecimals: 15, forceDecimals: true })

      expect(result).toBe('1,234.5678900000000')
    })
  })

  it('should return when null', () => {
    const result = printFormatedAmount(null)

    expect(result).toBe('')
  })
})

describe('printAmount()', () => {
  describe('when BigNumber', () => {
    const amount = BigNumber.from('1234567890000000000000')

    it('should return when no decimals', () => {
      const result = printAmount(amount)

      expect(result).toBe('1,234.56789')
    })

    it('should return when decimals', () => {
      const result = printAmount(amount, { decimals: 17 })

      expect(result).toBe('12,345.6789')
    })
  })

  describe('when string', () => {
    const amount = '1234567890000000000000'

    describe('when no decimals', () => {
      it('should return when no decimals', () => {
        const result = printAmount(amount)

        expect(result).toBe('1,234.56789')
      })

      it('should return when decimals', () => {
        const result = printAmount(amount, { decimals: 17 })

        expect(result).toBe('12,345.6789')
      })
    })

    it('should return when null', () => {
      const result = printAmount(null)

      expect(result).toBe('')
    })
  })
})

describe('Shorten address', () => {
  it('should return', () => {
    const result = shortenAddress('0x1234567890000000000000000000000123456789')

    expect(result).toBe('0x1234...6789')
  })
})
