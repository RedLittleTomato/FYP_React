import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
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
  const [dialog, setDialog] = useState(window.innerWidth < 760 ? true : false)

  useEffect(() => {
    let isMounted = true; // Can't perform a React state update on an unmounted component
    function handleResize() {
      if (isMounted) {
        if (window.innerWidth < 760) {
          setSize(window.innerWidth / 2)
          setDialog(true)
        } else {
          setDialog(false)
        }
      }
    }
    window.addEventListener("resize", handleResize);
    return () => { isMounted = false }
  }, [])

  return (
    <>
      <Dialog
        open={dialog}
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}>
        <div className={classes.dialog}>
          <img src={Sorry} alt="Sorry" width={size} height={size}></img>
          <p>This graphic editor does not recommend to use on mobile site.</p>
          <Button className={classes.button} variant="contained" color="primary" component={Link} to="/"> &lt; Back to Home</Button>
          <Button className={classes.button} variant="contained" color="secondary"
            onClick={e => {
              e.preventDefault()
              setDialog(false)
            }}
          >
            Continue to Use &gt; </Button>
        </div>
      </Dialog>
    </>
  )
}

export default BlockDialog
