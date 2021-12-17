import styled from 'styled-components'
import OrdersList from '../components/OrdersList'

export const SellOrdersList = styled(OrdersList)`
  grid-area: sell-orders;
  height: 100%;
`

export const BuyOrdersList = styled(OrdersList)`
  grid-area: buy-orders;
  height: 100%;
`
