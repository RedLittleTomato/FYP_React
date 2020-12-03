import React, { useState } from 'react'
import QrReader from 'react-qr-reader'
import { useHistory } from "react-router-dom";
import { Snackbar } from '../components/common'

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

  const handleScan = (data) => {
    if (data === null) return
    if (data && data.includes(process.env.REACT_APP_BASE_URL)) {
      history.push('/e-flyer');
    } else {
      setSnackbar({ 'open': true, severity: 'error', message: 'This QR code scanner only can be use get flyer.', loading: false })
    }
  }

  const handleLoad = () => {
    setSnackbar({ ...snackbar, 'open': false })
  }

  const handleError = (error) => {
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
      <QrReader
        delay={300}
        resolution={1200} // 600
        onError={error => handleError(error)}
        onScan={data => handleScan(data)}
        onLoad={() => handleLoad()}
      // style={{ height: '100%' }}
      />
    </div>
  )
}

export default QRScanner