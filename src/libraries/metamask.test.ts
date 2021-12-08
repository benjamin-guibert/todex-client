import { mocked } from 'ts-jest/utils'
import { BigNumber, ethers } from 'ethers'
import { Web3Provider } from '@ethersproject/providers'
import detectEthereumProvider from '@metamask/detect-provider'
import { connect, getAccount, getBalance, initialize } from './metamask'

jest.mock('@metamask/detect-provider')
const detectEthereumProviderMock = mocked(detectEthereumProvider)
const sendMock = jest.fn()
const getAddressMock = jest.fn()
const getSignerMock = jest.fn()
const getBalanceMock = jest.fn()
const handler = {
  provider: {
    send: sendMock,
    getSigner: getSignerMock,
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

  it('should reject when error', () => {
    detectEthereumProviderMock.mockRejectedValueOnce('error')

    expect(initialize()).rejects.toBe('error')

    expect(detectEthereumProviderMock).toBeCalledTimes(1)
  })
})

describe('connect()', () => {
  const account = '0x0'

  it('should return account when success', async () => {
    getSignerMock.mockReturnValue({
      getAddress: getAddressMock,
    })
    getAddressMock.mockResolvedValueOnce(account)

    const result = await connect(handler)

    expect(result).toBe(account)
    expect(sendMock).toBeCalledTimes(1)
    expect(sendMock.mock.calls[0][0]).toBe('eth_requestAccounts')
    expect(getSignerMock).toBeCalledTimes(1)
  })

  it('should reject when error', async () => {
    sendMock.mockRejectedValue('error')
    getSignerMock.mockReturnValue({ getAddress: getAddressMock })

    expect(connect(handler)).rejects.toBe('error')

    expect(sendMock).toBeCalledTimes(1)
    expect(sendMock.mock.calls[0][0]).toBe('eth_requestAccounts')
    expect(getSignerMock).toBeCalledTimes(0)
  })
})

describe('getAccount()', () => {
  const account = '0x0'

  it('should return account when success', async () => {
    getSignerMock.mockReturnValue({
      getAddress: getAddressMock,
    })
    getAddressMock.mockResolvedValueOnce(account)

    const result = await getAccount(handler)

    expect(result).toBe(account)
    expect(getAddressMock).toBeCalledTimes(1)
  })

  it('should return nothing when not connected', async () => {
    getSignerMock.mockReturnValue({
      getAddress: getAddressMock,
    })
    getAddressMock.mockRejectedValue('error')

    const result = await getAccount(handler)

    expect(result).toBeNull()
    expect(getAddressMock).toBeCalledTimes(1)
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

  it('should reject when error', async () => {
    getBalanceMock.mockRejectedValue('error')

    expect(getBalance(handler, account)).rejects.toBe('error')

    expect(getBalanceMock).toBeCalledTimes(1)
    expect(getBalanceMock.mock.calls[0][0]).toBe(account)
  })
})
