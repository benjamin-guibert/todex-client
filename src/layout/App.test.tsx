import * as React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import App from './App'

describe('<App />', () => {
  it('should render when not initialized', () => {
    ReactDOM.createPortal = jest.fn((element) => {
      return element
    }) as unknown as () => React.ReactPortal
    const component = renderer.create(<App />)

    expect(component.toJSON()).toMatchSnapshot()
  })
})
