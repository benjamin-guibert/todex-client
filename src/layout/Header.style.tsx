import styled from 'styled-components'
import { Spacers } from 'styles/sizes'
import Navbar from 'react-bootstrap/Navbar'

const StyledHeader = styled(Navbar)`
  grid-area: header;
  padding: ${Spacers.xs} ${Spacers.l};
`

export default StyledHeader
