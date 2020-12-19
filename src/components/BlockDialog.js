import React, { useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Dialog } from '@material-ui/core';
import Sorry from '../images/sorry.png'
import { Link } from 'react-router-dom';

import {
  Button
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  dialog: {
    textAlign: 'center',
    color: 'white'
  },
  button: {
    margin: '10px'
  }
}));

function BlockDialog() {
  const classes = useStyles();
  const [size, setSize] = useState(window.innerWidth / 2)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <>
      <Dialog
        open={fullScreen}
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}>
        <div className={classes.dialog}>
          <img src={Sorry} alt="Sorry" width={size} height={size}></img>
          <p>This graphic editor does not recommend to use on mobile site.</p>
          <Button className={classes.button} variant="contained" color="primary" component={Link} to="/">Back to Home</Button>
          {/* <Button className={classes.button} variant="contained" color="secondary"
            onClick={e => {
              e.preventDefault()
              setDialog(false)
            }}
          >
            Continue to Use &gt; </Button> */}
        </div>
      </Dialog>
    </>
  )
}

export default BlockDialog
