import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { userAPIs } from '../api'
import Logo from '../images/flyer.png'

import {
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Grid,
  TextField
} from '@material-ui/core';

import {
  Visibility,
  VisibilityOff
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#f5f5f6',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
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

function Login(props) {
  const { dialog, handleOnClose } = props
  const classes = useStyles()
  const history = useHistory()
  const [email, setEmail] = useState({
    value: '',
    error: false,
    errorMessage: ''
  });
  const [password, setPassword] = useState({
    value: '',
    error: false,
    errorMessage: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [login, setLogin] = useState(true)

  const handleChangeEmail = () => (event) => {
    setEmail({ ...email, 'value': event.target.value })
  };

  const handleChangePassword = () => (event) => {
    if (event.target.value === '') {
      setPassword({ ...password, 'error': true, 'value': event.target.value });
    } else {
      setPassword({ ...password, 'error': false, 'value': event.target.value })
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (e) => {
    const emailRE = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.value === '' || password.value === '') {
      if (email.value === '') {
        setEmail({ ...email, 'error': true, 'errorMessage': 'The email cannot be blank.' })
      }
      if (password.value === '') {
        setPassword({ ...password, 'error': true, 'errorMessage': 'The password cannot be blank.' })
      }
    } else if (!emailRE.test(email.value)) {
      setEmail({ ...email, 'error': true, 'errorMessage': 'The format of email is incorrect.' })
    } else {
      setEmail({ ...email, 'error': false })
      setPassword({ ...password, 'error': false })
      setIsLoading(true)
      const payload = {
        email: email.value.toLowerCase(),
        password: password.value
      }
      await userAPIs.login(payload)
        .then(async res => {
          const data = res.data
          if (!data.isAuth) {
            setLogin(false)
          } else {
            localStorage.setItem('user_id', data.id)
            localStorage.setItem('token', data.token)
            if (dialog) {
              // window.location.reload()
              handleOnClose()
            } else {
              history.push('/dashboard')
            }
          }
        })
        .catch(err => {
          const error = err
          console.log(error)
        })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!localStorage.token) return
    history.push('/dashboard')
  }, [history])

  useEffect(() => {
    function downHandler({ key }) {
      if (key === "Enter") {
        handleLogin()
      }
    }
    window.addEventListener('keydown', downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [handleLogin]);

  return (
    <>
      <Container maxWidth="xs" style={{ paddingTop: '70px' }}>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item className={classes.gridItem}>
            <img src={Logo} alt="logo" height="100px" />
          </Grid>
          <Grid item className={classes.gridItem}>
            <h3>Login</h3>
          </Grid>
          <Grid item className={classes.gridItem}>
            <TextField
              className={classes.textField}
              label="Email"
              // autoFocus
              value={email.value}
              error={email.error}
              helperText={email.error ? email.errorMessage : ' '}
              onChange={handleChangeEmail()}
            />
          </Grid>
          <Grid item className={classes.gridItem}>
            <TextField
              className={classes.textField}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password.value}
              error={password.error}
              helperText={password.error ? password.errorMessage : ' '}
              onChange={handleChangePassword()}
              InputProps={{
                endAdornment: <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }}
            />
          </Grid>
          <Grid item className={classes.gridItem} style={{ justifyContent: 'flex-end', fontSize: "14px" }}>
            <Link to="/forgot-password">Forgot password?</Link>
          </Grid>
          {!login && <p style={{ color: 'red' }}>Login failed.</p>}
          <Grid item className={classes.gridItem}>
            <Button className={classes.button} variant="contained" color="primary" onClick={handleLogin}>
              Login {isLoading && <CircularProgress style={{ color: 'white', marginLeft: "10px" }} size={15} />}
            </Button>
          </Grid>
          <Grid item className={classes.gridItem} style={{ paddingTop: "30px", fontSize: "14px" }}>
            <p>Don't have an account? <Link to="/register">Register Here</Link></p>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Login;