import { Web3Provider } from '@ethersproject/providers'
import { getEthBalance, getTokenBalance, initializeContract } from './exchange'
import { Token } from '../../contracts/Token'
import { Exchange } from '../../contracts/Exchange'
import { BigNumber } from '@ethersproject/bignumber'

const provider = {
  getSigner: jest.fn(),
} as unknown as Web3Provider
const token = {
  address: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
} as Token
const ethBalanceOfMock = jest.fn()
const tokenBalanceOfMock = jest.fn()
const exchange = {
  ethBalanceOf: ethBalanceOfMock,
  tokenBalanceOf: tokenBalanceOfMock,
} as unknown as Exchange

describe('initializeContract()', () => {
  it('should return handler when address defined', () => {
    process.env.REACT_APP_EXCHANGE_CONTRACT_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

    const handler = initializeContract(provider, token)

    expect(handler?.provider).toBe(provider)
    expect(handler?.token).toBe(token)
    expect(handler?.exchange).toBeDefined()
  })

  it('should return nothing when address not defined', () => {
    process.env.REACT_APP_EXCHANGE_CONTRACT_ADDRESS = ''

    const handler = initializeContract(provider, token)

    expect(handler).toBeUndefined()
  })
})

describe('getEthBalance()', () => {
  const account = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'
  const amount = BigNumber.from('1000000000000000000')
  const handler = {
    provider,
    token,
    exchange,
  }

  it('should return balance when success', async () => {
    ethBalanceOfMock.mockResolvedValueOnce(amount)

    const balance = await getEthBalance(handler, account)

    expect(balance).toBe(amount)
    expect(ethBalanceOfMock).toBeCalledTimes(1)
    expect(ethBalanceOfMock.mock.calls[0][0]).toBe(account)
  })

  it('should return nothing when failure', async () => {
    ethBalanceOfMock.mockRejectedValueOnce('error')

    const balance = await getEthBalance(handler, account)

    expect(balance).toBeUndefined()
    expect(ethBalanceOfMock).toBeCalledTimes(1)
    expect(ethBalanceOfMock.mock.calls[0][0]).toBe(account)
  })
})

describe('getTokenBalance()', () => {
  const account = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'
  const amount = BigNumber.from('1000000000000000000')
  const handler = {
    provider,
    token,
    exchange,
  }

  it('should return balance when success', async () => {
    tokenBalanceOfMock.mockResolvedValueOnce(amount)

    const balance = await getTokenBalance(handler, account)

    expect(balance).toBe(amount)
    expect(tokenBalanceOfMock).toBeCalledTimes(1)
    expect(tokenBalanceOfMock.mock.calls[0][0]).toBe(token.address)
    expect(tokenBalanceOfMock.mock.calls[0][1]).toBe(account)
  })

  it('should return nothing when failure', async () => {
    tokenBalanceOfMock.mockRejectedValueOnce('error')

    const balance = await getTokenBalance(handler, account)

    expect(balance).toBeUndefined()
    expect(tokenBalanceOfMock).toBeCalledTimes(1)
    expect(tokenBalanceOfMock.mock.calls[0][0]).toBe(token.address)
    expect(tokenBalanceOfMock.mock.calls[0][1]).toBe(account)
  })
})
