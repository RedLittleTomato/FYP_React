import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { QRScanner } from '../components'

const useStyles = makeStyles(() => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
}))

function QRcodeScanner() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <QRScanner />
      {/* <QRGenerator fullScreen={true} open={true} flyerName="flyer" type="pdf" url="https://www.google.com/" /> */}
    </div>
  )
}

export default QRcodeScanner
