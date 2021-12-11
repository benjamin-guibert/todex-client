import React, { FC, useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import { parseEther } from 'ethers/lib/utils'

interface AmountInput {
  value: string
  isValid: boolean | undefined
  invalidMessage: string | undefined
}

interface DepositWithdrawInputProps {
  name: string
  onDeposit: (amount: BigNumber) => void
  isDepositAllowed?: (amount: BigNumber) => Promise<boolean>
  onApprove?: (amount: BigNumber) => Promise<void>
}

const DepositWithdrawInput: FC<DepositWithdrawInputProps> = ({ name, onDeposit, isDepositAllowed, onApprove }) => {
  const [amountInput, setAmountInput] = useState<AmountInput>({
    value: '',
    isValid: undefined,
    invalidMessage: undefined,
  })
  const [canDeposit, setCanDeposit] = useState<boolean>(!isDepositAllowed)

  const approveAmount = () => {
    if (!onApprove || !amountInput.isValid) {
      return
    }

    onApprove(parseEther(amountInput.value))
  }

  const depositAmount = () => {
    if (!amountInput.isValid) {
      return
    }

    onDeposit(parseEther(amountInput.value))
    setAmountInput({
      value: '',
      isValid: undefined,
      invalidMessage: undefined,
    })
  }

  useEffect(() => {
    const checkAmountInput = async () => {
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

      if (isDepositAllowed) {
        setCanDeposit(await isDepositAllowed(parseEther(amountInput.value)))
      }

      setAmountInput((previousInput) => {
        return { ...previousInput, isValid: true, invalidMessage: undefined }
      })
    }

    checkAmountInput()
  }, [amountInput.value, isDepositAllowed])

  return (
    <Card className="m-3 px-2 py-1">
      <Form>
        <Row className="my-3">
          <InputGroup hasValidation>
            <InputGroup.Text>{name}</InputGroup.Text>
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
        </Row>
        <Row className="my-3">
          <ButtonGroup>
            {canDeposit && (
              <Button onClick={depositAmount} disabled={!amountInput.isValid}>
                Deposit
              </Button>
            )}
            {!canDeposit && (
              <Button onClick={approveAmount} disabled={!amountInput.isValid}>
                Deposit (Approve)
              </Button>
            )}
            <Button disabled={!amountInput.isValid}>Withdraw</Button>
          </ButtonGroup>
        </Row>
      </Form>
    </Card>
  )
}

export default DepositWithdrawInput
