import React from 'react'
import { CircularProgress, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const anchorList = {
  'tl': { vertical: 'top', horizontal: 'left' },
  'tc': { vertical: 'top', horizontal: 'center' },
  'tr': { vertical: 'top', horizontal: 'right' },
  'bl': { vertical: 'bottom', horizontal: 'left' },
  'bc': { vertical: 'bottom', horizontal: 'center' },
  'br': { vertical: 'bottom', horizontal: 'right' },
}

function SnackbarCPNT(props) {
  const { open, handleClose, anchor, duration, severity, loading, children, ...rest } = props

  return (
    <>
      <Snackbar open={open} autoHideDuration={duration ? (duration === 'null' ? null : duration) : 5000} onClose={handleClose} anchorOrigin={anchor ? anchorList[anchor] : anchorList.bc} {...rest}>
        <Alert variant="filled" onClose={handleClose} severity={severity} style={{ width: '330px' }}>
          {children} {loading && <CircularProgress style={{ color: 'white', marginLeft: "10px" }} size={15} />}
        </Alert>
      </Snackbar>
    </>
  )
}

export default SnackbarCPNT
