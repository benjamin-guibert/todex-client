import styled from 'styled-components'
import Container from 'react-bootstrap/Container'
import { Spacers } from 'styles/sizes'

export const MainContainer = styled(Container)`
  display: grid;
  grid-template-columns: 30% 30% auto;
  grid-template-rows: 50% 50%;
  grid-template-areas:
    'forms sell-orders trade-chart'
    'forms buy-orders  trade-history';
  column-gap: ${Spacers.m};
  row-gap: ${Spacers.m};
  padding: ${Spacers.m};
  height: 100%;
`

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export default StyledApp
