import { mocked } from 'ts-jest/utils'
import { BigNumber, ethers } from 'ethers'
import { Web3Provider } from '@ethersproject/providers'
import detectEthereumProvider from '@metamask/detect-provider'
import { connect, getAccount, getBalance, initialize } from './metamask'

jest.mock('@metamask/detect-provider')
const detectEthereumProviderMock = mocked(detectEthereumProvider)
const sendMock = jest.fn()
const listAccountsMock = jest.fn()
const getBalanceMock = jest.fn()
const handler = {
  provider: {
    send: sendMock,
    listAccounts: listAccountsMock,
    getBalance: getBalanceMock,
  } as unknown as Web3Provider,
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('initialize()', () => {
  it('should return provider when connected', async () => {
    detectEthereumProviderMock.mockResolvedValueOnce(new ethers.providers.JsonRpcProvider())

    const result = await initialize()

    expect(result).toBeDefined()
    expect(detectEthereumProviderMock).toBeCalledTimes(1)
  })

  it('should return nothing when not installed', async () => {
    detectEthereumProviderMock.mockResolvedValueOnce(undefined)

    const result = await initialize()

    expect(result).toBeUndefined()
    expect(detectEthereumProviderMock).toBeCalledTimes(1)
  })

  it('should fail when error', () => {
    detectEthereumProviderMock.mockRejectedValueOnce('error')

    expect(() => initialize()).rejects.toBe('error')

    expect(detectEthereumProviderMock).toBeCalledTimes(1)
  })
})

describe('connect()', () => {
  const account = '0x0'

  it('should return account when success', async () => {
    listAccountsMock.mockResolvedValueOnce([account, '0x1'])

    const result = await connect(handler)

    expect(result).toBe(account)
    expect(sendMock).toBeCalledTimes(1)
    expect(listAccountsMock).toBeCalledTimes(1)
  })

  it('should return nothing when failure', async () => {
    sendMock.mockRejectedValue('error')
    listAccountsMock.mockResolvedValueOnce([account, '0x1'])

    const result = await connect(handler)

    expect(result).toBeUndefined()
    expect(sendMock).toBeCalledTimes(1)
    expect(listAccountsMock).toBeCalledTimes(0)
  })
})

describe('getAccount()', () => {
  const account = '0x0'

  it('should return account when success', async () => {
    listAccountsMock.mockResolvedValueOnce([account, '0x1'])

    const result = await getAccount(handler)

    expect(result).toBe(account)
    expect(listAccountsMock).toBeCalledTimes(1)
  })

  it('should return nothing when failure', async () => {
    listAccountsMock.mockRejectedValue('error')

    const result = await getAccount(handler)

    expect(result).toBeUndefined()
    expect(listAccountsMock).toBeCalledTimes(1)
  })
})

describe('getBalance()', () => {
  const account = '0x0'
  const balance = BigNumber.from('100000000000000000')

  it('should return balance when success', async () => {
    getBalanceMock.mockResolvedValueOnce(balance)

    const result = await getBalance(handler, account)

    expect(result).toBe(balance)
    expect(getBalanceMock).toBeCalledTimes(1)
    expect(getBalanceMock.mock.calls[0][0]).toBe(account)
  })

  it('should return nothing when failure', async () => {
    getBalanceMock.mockRejectedValue('error')

    const result = await getBalance(handler, account)

    expect(result).toBeUndefined()
    expect(getBalanceMock).toBeCalledTimes(1)
    expect(getBalanceMock.mock.calls[0][0]).toBe(account)
  })
})
