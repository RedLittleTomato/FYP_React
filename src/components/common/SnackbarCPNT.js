import React from 'react'
import PropTypes from 'prop-types'
import { Snackbar } from '@material-ui/core';

SnackbarCPNT.propTypes = {
  open: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

SnackbarCPNT.defaultProps = {

}

function SnackbarCPNT({ open, children, ...props }) {
  const anchor = {
    'tl': { vertical: 'top', horizontal: 'left' },
    'tc': { vertical: 'top', horizontal: 'center' },
    'tr': { vertical: 'top', horizontal: 'right' },
    'bl': { vertical: 'bottom', horizontal: 'left' },
    'bc': { vertical: 'bottom', horizontal: 'center' },
    'br': { vertical: 'bottom', horizontal: 'right' },
  }
  return (
    <>
      <Snackbar open {...props}>
        {children}
      </Snackbar>
    </>
  )
}

export default SnackbarCPNT
