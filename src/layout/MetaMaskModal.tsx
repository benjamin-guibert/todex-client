import React, { FC, useContext, useEffect, useState } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import Modal from 'react-bootstrap/Modal'
import { InitializationStatus, MetaMaskContext } from './MetaMaskContext'

const MetaMaskModal: FC = () => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const { initializationStatus } = useContext(MetaMaskContext)

  useEffect(() => {
    switch (initializationStatus) {
      case InitializationStatus.Initializing:
        setLoading(true)
        setError(null)
        break
      case InitializationStatus.Initialized:
        setLoading(false)
        setError(null)
        break
      case InitializationStatus.NotInstalled:
        setLoading(false)
        setError('Please install MetaMask.')
        break
      case InitializationStatus.Error:
        setLoading(false)
        setError('Error: cannot connect to MetaMask')
        break
      default:
        setLoading(false)
        break
    }
  }, [initializationStatus])

  return (
    <>
      <Modal show={loading || !!error} size="sm" centered>
        <Modal.Header>
          <Modal.Title>MetaMask</Modal.Title>
        </Modal.Header>
        {loading && (
          <Modal.Body style={{ textAlign: 'center' }}>
            <Spinner animation="border" />
          </Modal.Body>
        )}
        {!!error && <Modal.Body>{error}</Modal.Body>}
      </Modal>
    </>
  )
}

export default MetaMaskModal
