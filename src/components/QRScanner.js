import React, { useState } from 'react'
import QrReader from 'react-qr-reader'
import { useHistory } from "react-router-dom";
import { Snackbar } from '../components/common'
import { Container } from '@material-ui/core';

function QRScanner() {

  const history = useHistory()

  const [snackbar, setSnackbar] = useState({
    open: true,
    anchor: 'tc',
    duration: 'null',
    severity: 'info',
    message: 'Preparing the camera',
    loading: true
  })

  const handleOnScan = (data) => {
    if (data === null) return
    if (data && data.includes(process.env.REACT_APP_BASE_URL)) {
      history.push('/e-flyer');
    } else {
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'This QR code scanner only can be used to get flyer.',
        loading: false
      })
    }
  }

  const handleOnLoad = () => {
    setSnackbar({ ...snackbar, 'open': false })
  }

  const handleOnError = (error) => {
    console.log(error)
  }

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <div>
      <Snackbar
        open={snackbar.open}
        handleClose={handleSnackbarClose}
        anchor={snackbar.anchor}
        duration={snackbar.duration}
        severity={snackbar.severity}
        loading={snackbar.loading}
      >
        {snackbar.message}
      </Snackbar>
      <Container maxWidth="sm">
        <div style={{ backgroundColor: 'white', border: '1px solid red' }}>
          <QrReader
            delay={300} // 500
            resolution={1200} // 600
            showViewFinder={false}
            onError={error => handleOnError(error)}
            onScan={data => handleOnScan(data)}
            onLoad={() => handleOnLoad()}
          />
        </div>
      </Container>
    </div>
  )
}

export default QRScanner