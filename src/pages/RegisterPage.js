import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPIs } from '../api'
import Logo from '../images/flyer.png'

import {
  makeStyles
} from '@material-ui/core/styles';

import {
  Button,
  Container,
  CircularProgress,
  IconButton,
  InputAdornment,
  Grid,
  Snackbar,
  TextField
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

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
}));

function RegisterPage() {
  const classes = useStyles()
  const [username, setUsername] = useState({
    value: '',
    error: false,
    errorMessage: ''
  });
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
  const [confirmPassword, setConfirmPassword] = useState({
    value: '',
    error: false,
    errorMessage: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [register, setRegister] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: '',
    message: ''
  })

  const handleChangeUsername = () => (event) => {
    setUsername({ ...username, 'value': event.target.value });
  };

  const handleChangeEmail = () => (event) => {
    setEmail({ ...email, 'value': event.target.value });
  };

  const handleChangePassword = () => (event) => {
    setPassword({ ...password, 'value': event.target.value });
  };

  const handleChangeConfirmPassword = () => (event) => {
    setConfirmPassword({ ...confirmPassword, 'value': event.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, 'open': false })
  }

  const handleRegister = async () => {
    const emailRE = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (username.value === '' || email.value === '' || password.value === '' || confirmPassword.value === '') {
      if (username.value === '') {
        setUsername({ ...username, 'error': true, 'errorMessage': 'The username cannot be blank.' })
      }
      if (email.value === '') {
        setEmail({ ...email, 'error': true, 'errorMessage': 'The email cannot be blank.' })
      }
      if (password.value === '') {
        setPassword({ ...password, 'error': true, 'errorMessage': 'The password cannot be blank.' })
      }
      if (confirmPassword.value === '') {
        setConfirmPassword({ ...confirmPassword, 'error': true, 'errorMessage': 'The confirm password cannot be blank.' })
      }
      // } else if (username.value.length < 5) {
      //   setUsername({ ...username, 'error': true, 'errorMessage': 'The username needs to more then 5 characters.' })
    } else if (!emailRE.test(email.value)) {
      setEmail({ ...email, 'error': true, 'errorMessage': 'The format of email is incorrect.' })
      // } else if (password.value.length < 8) {
      //   setPassword({ ...username, 'error': true, 'errorMessage': 'The password needs to more then 8 characters.' })
    } else if (password.value !== confirmPassword.value) {
      setPassword({ ...password, 'error': false, 'errorMessage': '' })
      setConfirmPassword({ ...confirmPassword, 'error': true, 'errorMessage': 'Passwords not same.' })
    } else {
      setUsername({ ...username, 'error': false })
      setEmail({ ...email, 'error': false })
      setPassword({ ...password, 'error': false })
      setConfirmPassword({ ...confirmPassword, 'error': false })
      setIsLoading(true)
      const payload = {
        username: username.value,
        email: email.value,
        password: password.value
      }
      await userAPIs.register(payload).then(res => {
        const data = res.data
        if (data.success) {
          setRegister(true)
          setSnackbar({ open: true, severity: 'success', message: data.message })
        } else {
          setRegister(false)
          setSnackbar({ open: true, severity: 'error', message: data.message })
        }
      })
        .catch(error => {
          setSnackbar({ open: true, severity: 'error', message: `Something wrong happens. => ${error}` })
        })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    function downHandler({ key }) {
      if (key === "Enter") {
        handleRegister()
      }
    }
    window.addEventListener('keydown', downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [handleRegister]);

  return (
    <div className={classes.root}>
      <Container maxWidth="xs" className={classes.container}>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item className={classes.gridItem}>
            <img src={Logo} alt="logo" height="100px" />
          </Grid>
          <Grid item className={classes.gridItem}>
            <h3>Register</h3>
          </Grid>
          <Grid item className={classes.gridItem}>
            <TextField
              className={classes.textField}
              label="Username"
              // autoFocus
              value={username.value}
              error={username.error}
              helperText={username.error ? username.errorMessage : ' '}
              onChange={handleChangeUsername()}
            />
          </Grid>
          <Grid item className={classes.gridItem}>
            <TextField
              className={classes.textField}
              label="Email"
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
                  <IconButton onClick={handleClickShowPassword} >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>,
              }}
            />
          </Grid>
          <Grid item className={classes.gridItem}>
            <TextField
              className={classes.textField}
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword.value}
              error={confirmPassword.error}
              helperText={confirmPassword.error ? confirmPassword.errorMessage : ' '}
              onChange={handleChangeConfirmPassword()}
              InputProps={{
                endAdornment: <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>,
              }}
            />
          </Grid>
          <Grid item className={classes.gridItem}>
            <Button className={classes.button} variant="contained" color="primary" onClick={handleRegister}>
              Register
            {isLoading && <CircularProgress style={{ marginLeft: "10px" }} size={15} />}
            </Button>
          </Grid>
          <Grid item className={classes.gridItem}>
            {register && <Button className={classes.button} variant="outlined" color="primary" component={Link} to="/login">
              Proceed to Login
          </Button>}
          </Grid>
          <Grid item className={classes.gridItem} style={{ paddingTop: "30px", fontSize: "14px" }}>
            <p>Have account? <Link to="/login">Login Here</Link></p>
          </Grid>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Grid>
      </Container>
    </div>
  )
}

export default RegisterPage;