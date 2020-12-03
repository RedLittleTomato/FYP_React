import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

import {
  Backdrop,
  CircularProgress,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
}));

function LoadingScreen(props) {
  const classes = useStyles()
  const { open } = props

  return (
    <>
      <Backdrop className={classes.backdrop} open={open} >
        <CircularProgress color="inherit" size={30} />
      </Backdrop>
    </>
  )
}

export default LoadingScreen
