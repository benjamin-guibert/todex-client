import React from 'react'
import { render } from 'react-dom'
import IndexStyle from 'index.style'
import App from 'layout/App'
import 'bootstrap/dist/css/bootstrap.min.css'

render(
  <>
    <IndexStyle />
    <App />
  </>,
  document.getElementById('root')
)
