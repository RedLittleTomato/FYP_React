import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { userAPIs } from '../api'
import Logo from '../images/flyer.png'

import {
  Button,
  Container,
  CircularProgress,
  Grid,
  TextField
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#f5f5f6',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    paddingTop: '70px'
  },
  gridContainer: {
    backgroundColor: 'white',
    padding: '50px',
    [theme.breakpoints.down('sm')]: {
      padding: '20px',
    },
  },
  gridItem: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    width: '100%',
  },
  textField: {
    width: '100%',
  },
}))

function ForgotPassword() {
  const classes = useStyles()
  const [email, setEmail] = useState({
    value: '',
    error: false,
    errorMessage: ''
  });
  const [error, setError] = useState({
    error: false,
    errorMessage: ''
  })
  const [loading, setLoading] = useState(false)

  const handleEmailChange = () => (event) => {
    setEmail({ ...email, 'value': event.target.value });
  };

  const handleSubmit = async () => {
    const emailRE = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.value === '') {
      setEmail({ ...email, 'error': true, 'errorMessage': 'The email cannot be blank.' })
    } else if (!emailRE.test(email.value)) {
      setEmail({ ...email, 'error': true, 'errorMessage': 'The format of email is incorrect.' })
    } else {
      setEmail({ ...email, error: false })
      setLoading(true)
      const payload = {
        email: email.value
      }
      await userAPIs.forgotPassword(payload)
        .then(res => {
          const data = res.data
          setError({ error: false, errorMessage: data.message })
        })
        .catch(error => {
          const res = error.response.data
          setError({ error: true, errorMessage: typeof res.error === 'object' ? res.error.code : res.error })
        })
      setLoading(false)
    }
  };

  useEffect(() => {
    function downHandler({ key }) {
      if (key === "Enter") {
        handleSubmit()
      }
    }
    window.addEventListener('keydown', downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [handleSubmit]);

  return (
    <div className={classes.root}>
      <Container maxWidth="xs" className={classes.container}>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item className={classes.gridItem}>
            <img src={Logo} alt="logo" height="100px" />
          </Grid>
          <Grid item className={classes.gridItem}>
            <h3>Forgot Password</h3>
          </Grid>
          <Grid item className={classes.gridItem} style={{ textAlign: 'justify' }}>
            Enter the email address that you registered with us and we will send you the link to reset your password.
          </Grid>
          <Grid item className={classes.gridItem}>
            <TextField
              className={classes.textField}
              label="Email"
              onChange={handleEmailChange()}
              value={email.value}
              error={email.error}
              helperText={email.error ? email.errorMessage : ' '}
            />
          </Grid>
          <Grid item className={classes.gridItem}>
            <Button
              className={classes.button}
              type="submit"
              color="primary"
              variant="contained"
              onClick={handleSubmit}
            >
              Submit {loading && <CircularProgress style={{ color: 'white', marginLeft: "10px" }} size={15} />}
            </Button>
          </Grid>
          <Grid item className={classes.gridItem}>
            <p style={{ textAlign: 'justify', color: error.error ? 'red' : 'green' }}>{error.errorMessage}</p>
          </Grid>
          <Grid item className={classes.gridItem} style={{ paddingTop: "30px", fontSize: "14px" }}>
            <p>Don't have an account? <Link to="/register">Register Here</Link></p>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default ForgotPassword
