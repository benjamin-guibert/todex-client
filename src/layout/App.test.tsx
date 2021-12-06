import * as React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import App from './App'
import Header from './Header'

describe('<App />', () => {
  it('should render', () => {
    ReactDOM.createPortal = jest.fn((element) => {
      return element
    }) as unknown as () => React.ReactPortal
    const component = renderer.create(<App />)

    expect(component.root.findByType(Header)).toBeDefined()
    expect(component.toJSON()).toMatchSnapshot()
  })
})
