import * as React from 'react'
import DepositWithdraw from './DepositWithdraw'
import renderer from 'react-test-renderer'

const renderComponent = () => renderer.create(<DepositWithdraw />)

describe('<DepositWithdraw />', () => {
  it('should render', () => {
    const result = renderComponent()

    expect(result.toJSON()).toMatchSnapshot()
  })
})
