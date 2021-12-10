import { Web3Provider } from '@ethersproject/providers'
import { initializeContract } from './token'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('initializeContract()', () => {
  const getSignerMock = jest.fn()
  const provider = {
    getSigner: getSignerMock,
  } as unknown as Web3Provider

  it('should return handler when address defined', () => {
    process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    const handler = initializeContract(provider)

    expect(handler?.provider).toBe(provider)
    expect(handler?.token).toBeDefined()
    expect(getSignerMock).toBeCalledTimes(1)
  })

  it('should throw when address not defined', () => {
    process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS = ''

    expect(() => initializeContract(provider)).toThrow('Token address missing')

    expect(getSignerMock).toBeCalledTimes(0)
  })
})
