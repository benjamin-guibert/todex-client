import styled from 'styled-components'
import Container from 'react-bootstrap/Container'
import { Spacers } from 'styles/sizes'

export const MainContainer = styled(Container)`
  display: grid;
  grid-template-columns: auto auto auto min-content;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas:
    '. . . trade-history'
    '. . . trade-history'
    '. . . trade-history';
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
