import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { Collapse, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

AlertCPNT.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

AlertCPNT.defaultProps = {

}

const useStyles = makeStyles(() => ({
  root: {
    margin: '10px'
  },
}));

function AlertCPNT(props) {
  const classes = useStyles()
  const { children, open, setOpen } = props

  return (
    <div>
      <Collapse in={open}>
        <Alert
          className={classes.root}
          {...props}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {children}
        </Alert>
      </Collapse>
    </div>
  )
}

export default AlertCPNT
