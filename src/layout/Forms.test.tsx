import * as React from 'react'
import Forms from './Forms'
import renderer from 'react-test-renderer'

const renderComponent = () => renderer.create(<Forms />)

describe('<Forms />', () => {
  it('should render', () => {
    const result = renderComponent()

    expect(result.toJSON()).toMatchSnapshot()
  })
})
