import React, { FC, useContext, useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import { AmountInput } from './types'
import { formatEther, parseEther, parseUnits } from 'ethers/lib/utils'
import { DECIMALS } from 'libraries/contracts/helpers'
import { BigNumber } from 'ethers'
import { ExchangeContext } from 'layout/ExchangeContext'
import { MetaMaskContext } from 'layout/MetaMaskContext'
import { TradeType } from 'models/Trade'

const OrderForm: FC = () => {
  const [amountInput, setAmountInput] = useState<AmountInput>({
    value: '',
    isValid: undefined,
    invalidMessage: undefined,
  })
  const [unitPriceInput, setUnitPriceInput] = useState<AmountInput>({
    value: '',
    isValid: undefined,
    invalidMessage: undefined,
  })
  const [totalPrice, setTotalPrice] = useState<string | undefined>()
  const [canSell, setCanSell] = useState<boolean>(false)
  const [canBuy, setCanBuy] = useState<boolean>(false)
  const { account } = useContext(MetaMaskContext)
  const { ethBalance, tokenBalance, createOrder } = useContext(ExchangeContext)

  const areInputsValid = amountInput.isValid && unitPriceInput.isValid

  const createNewOrder = (type: TradeType) => {
    return {
      type,
      account: account as string,
      amount: parseUnits(amountInput.value).toString(),
      totalPrice: parseUnits(totalPrice as string).toString(),
    }
  }

  const buy = () => {
    if (!canBuy) {
      return
    }

    createOrder(createNewOrder(TradeType.Buy))
  }

  const sell = () => {
    if (!canSell) {
      return
    }
    createOrder(createNewOrder(TradeType.Sell))
  }

  useEffect(() => {
    if (amountInput.value == '') {
      return setAmountInput((previousInput) => {
        return { ...previousInput, isValid: undefined, invalidMessage: undefined }
      })
    }

    const amount = Number.parseFloat(amountInput.value)
    if (isNaN(amount)) {
      return setAmountInput((previousInput) => {
        return { ...previousInput, isValid: false, invalidMessage: 'Invalid input' }
      })
    }

    setAmountInput((previousInput) => {
      return { ...previousInput, isValid: true, invalidMessage: undefined }
    })
  }, [amountInput.value])

  useEffect(() => {
    if (unitPriceInput.value == '') {
      return setUnitPriceInput((previousInput) => {
        return { ...previousInput, isValid: undefined, invalidMessage: undefined }
      })
    }

    const unitPrice = Number.parseFloat(unitPriceInput.value)
    if (isNaN(unitPrice)) {
      return setUnitPriceInput((previousInput) => {
        return { ...previousInput, isValid: false, invalidMessage: 'Invalid input' }
      })
    }

    setUnitPriceInput((previousInput) => {
      return { ...previousInput, isValid: true, invalidMessage: undefined }
    })
  }, [unitPriceInput.value])

  useEffect(() => {
    if (!areInputsValid || !amountInput.value || !unitPriceInput.value) {
      setCanSell(false)
      setCanBuy(false)
      return setTotalPrice(undefined)
    }

    const totalPrice = parseEther(amountInput.value)
      .mul(parseEther(unitPriceInput.value))
      .div(BigNumber.from(10).pow(DECIMALS))

    setTotalPrice(formatEther(totalPrice))

    setCanSell(!parseEther(amountInput.value).gte(BigNumber.from(tokenBalance)))
    setCanBuy(!totalPrice.gte(BigNumber.from(ethBalance)))
  }, [amountInput, areInputsValid, unitPriceInput, ethBalance, tokenBalance])

  return (
    <Card className="m-3 px-2 py-1 text-dark">
      <Form>
        <Form.Group as={Row} className="my-3">
          <Form.Label column sm={3} className="text-end">
            Amount
          </Form.Label>
          <Col className="my-auto">
            <InputGroup hasValidation>
              <InputGroup.Text>TDX</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={'0'}
                value={amountInput.value}
                onChange={(event) =>
                  setAmountInput((previous: AmountInput) => {
                    return { ...previous, value: event.target.value }
                  })
                }
                isValid={amountInput.isValid}
                isInvalid={amountInput.isValid == false}
              />
            </InputGroup>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="my-3">
          <Form.Label column sm={3} className="text-end">
            Unit price
          </Form.Label>
          <Col className="my-auto">
            <InputGroup hasValidation>
              <InputGroup.Text>ETH</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={'0'}
                value={unitPriceInput.value}
                onChange={(event) =>
                  setUnitPriceInput((previous: AmountInput) => {
                    return { ...previous, value: event.target.value }
                  })
                }
                isValid={unitPriceInput.isValid}
                isInvalid={unitPriceInput.isValid == false}
              />
            </InputGroup>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="my-3">
          <Form.Label column sm={3} className="text-end">
            Total price:
          </Form.Label>
          <Col className="my-auto">
            <Form.Control
              className="font-monospace"
              plaintext
              readOnly
              defaultValue={totalPrice ? `ETH ${totalPrice}` : ''}
            />
          </Col>
        </Form.Group>
        <Row className="my-3">
          <ButtonGroup>
            <Button variant="danger" onClick={buy} disabled={!canBuy}>
              Buy
            </Button>
            <Button variant="success" onClick={sell} disabled={!canSell}>
              Sell
            </Button>
          </ButtonGroup>
        </Row>
      </Form>
    </Card>
  )
}

export default OrderForm
