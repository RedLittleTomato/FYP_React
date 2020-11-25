import React from 'react'
import PropTypes from 'prop-types'
import { Dialog } from '@material-ui/core';

DialogCPNT.propTypes = {
  open: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

DialogCPNT.defaultProps = {

}

function DialogCPNT({ open, children, ...props }) {
  return (
    <>
      <Dialog open {...props}>
        {children}
      </Dialog>
    </>
  )
}

export default DialogCPNT
