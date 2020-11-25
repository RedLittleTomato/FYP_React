import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

import {
  CircularProgress,
  Dialog
} from '@material-ui/core'

const useStyles = makeStyles(() => ({
  dialog: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  }
}));

function LoadingScreen(props) {
  const classes = useStyles()
  const { open } = props

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          }
        }}>
        <div className={classes.dialog}>
          <CircularProgress style={{ color: 'white' }} size={30} />
        </div>
      </Dialog>
    </>
  )
}

export default LoadingScreen
