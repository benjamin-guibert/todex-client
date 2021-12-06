import { Web3Provider } from '@ethersproject/providers'
import { initializeContract } from './token'

describe('initializeContract()', () => {
  const provider = {
    getSigner: jest.fn(),
  } as unknown as Web3Provider

  it('should return handler when address defined', () => {
    process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

    const handler = initializeContract(provider)

    expect(handler?.provider).toBe(provider)
    expect(handler?.token).toBeDefined()
  })

  it('should return nothing when address not defined', () => {
    process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS = ''

    const handler = initializeContract(provider)

    expect(handler).toBeUndefined()
  })
})
