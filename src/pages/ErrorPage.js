import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom';
import Error from '../images/error.png'

import {
  Button,
  Container
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    color: '#ffffff',
    backgroundColor: '#d04746',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    margin: '25px',
    color: '#d04746',
    backgroundColor: '#ffffff',
  }
}))

function ErrorPage() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Container maxWidth="xs" className={classes.container}>
        <img src={Error} alt="error" width="100%" />
        Oops something went wrong!
        <Button className={classes.button} component={Link} to="/">Return to home</Button>
      </Container>
    </div>
  )
}

export default ErrorPage
