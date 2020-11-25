import React, { useState } from 'react'
import QrReader from 'react-qr-reader'
import { useHistory } from "react-router-dom";
import { Alert } from '../components/common'
import { CircularProgress, IconButton } from '@material-ui/core';
import FlipCamera from '@material-ui/icons/FlipCameraIos';

function QRScanner() {
  const history = useHistory()
  const [alertMessage, setAlertMessage] = useState()
  const [openAlert, setOpenAlert] = useState(false)
  const [cameraMode, setCameraMode] = useState("environment")
  const [load, setLoad] = useState(false)

  const handleScan = (data) => {
    if (data === null) return
    if (data && data.includes(process.env.REACT_APP_BASE_URL)) {
      history.push('/e-flyer');
    } else {
      setOpenAlert(true)
      setAlertMessage("Sorry. This QR code scanner only use for preview the e-flyer on this site.")
    }
  }

  const handleError = (error) => {
    console.log(error)
  }

  const handleChangeCamera = () => {
    setLoad(false)
    if (cameraMode === "environment") {
      setCameraMode("user")
    } else {
      setCameraMode("environment")
    }
  }

  return (
    <div>
      <Alert severity="error" variant="filled" open={openAlert} setOpen={setOpenAlert}>{alertMessage}</Alert>
      <Alert severity="info" variant="filled" open={!load} setOpen={setLoad}>
        Preparing the camera
        <CircularProgress style={{ marginLeft: "10px" }} color="white" size={15} />
      </Alert>
      <IconButton
        aria-label="close"
        color="inherit"
        size="small"
        onClick={handleChangeCamera}
      >
        <FlipCamera fontSize="inherit" />
      </IconButton>
      <QrReader
        delay={300}
        resolution={1200} // 600
        facingMode={cameraMode}
        onError={error => handleError(error)}
        onScan={data => handleScan(data)}
        onLoad={() => setLoad(true)}
      // style={{ height: '100%' }}
      />
    </div>
  )
}

export default QRScanner