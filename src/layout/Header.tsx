import React, { FC, useContext } from 'react'
import { InitializationStatus, MetaMaskContext } from './MetaMaskContext'
import { ethers } from 'ethers'
import { printAmount, shortenAddress } from 'libraries/helpers'
import { ExchangeContext } from './ExchangeContext'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import StyledHeader from './Header.style'

const printBalance = (balance?: string) => {
  return printAmount(balance || null)
}

const Header: FC = () => {
  const { initializationStatus, account, connect } = useContext(MetaMaskContext)
  const { ethBalance, tokenBalance } = useContext(ExchangeContext)

  return (
    <StyledHeader bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand>ToDEX</Navbar.Brand>
        {initializationStatus == InitializationStatus.Initialized && (
          <>
            {!!ethBalance && <Navbar.Text>{`${ethers.constants.EtherSymbol} ${printBalance(ethBalance)}`}</Navbar.Text>}
            {!!tokenBalance && <Navbar.Text>{`ToDEX ${printBalance(tokenBalance)}`}</Navbar.Text>}
            {!!account && <Navbar.Text>{shortenAddress(account)}</Navbar.Text>}
            {!account && <Button onClick={connect}>Connect Wallet</Button>}
          </>
        )}
      </Container>
    </StyledHeader>
  )
}

export default Header
