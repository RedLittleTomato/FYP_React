import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { userAPIs } from '../api'
import Logo from '../images/flyer.png'

import {
  Button,
  Container,
  CircularProgress,
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

function Reset() {
  const classes = useStyles();
  const history = useHistory()
  const query = new URLSearchParams(useLocation().search);

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
  const [disableUpdatePassword, setDisableUpdatePassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState('')
  const [updated, setUpdated] = useState({
    value: false,
    message: ''
  })

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

  const handleUpdatePassword = async () => {
    if (password.value === '' || confirmPassword.value === '') {
      if (password.value === '') {
        setPassword({ ...password, 'error': true, 'errorMessage': 'The password cannot be blank.' })
      }
      if (confirmPassword.value === '') {
        setConfirmPassword({ ...confirmPassword, 'error': true, 'errorMessage': 'The confirm password cannot be blank.' })
      }
    } else if (password.value !== confirmPassword.value) {
      setPassword({ ...password, 'error': false, 'errorMessage': '' })
      setConfirmPassword({ ...confirmPassword, 'error': true, 'errorMessage': 'Passwords not same.' })
    } else {
      setPassword({ ...password, 'error': false })
      setConfirmPassword({ ...confirmPassword, 'error': false })
      setIsLoading(true)
      const payload = {
        user_id: userId,
        password: password.value
      }
      await userAPIs.updatePassword(payload)
        .then(res => {
          const data = res.data
          setDisableUpdatePassword(true)
          setUpdated({ value: true, message: data.message })
        })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = query.get("t")
    async function checkResetValidation() {
      await userAPIs.resetValidation(token)
        .then(res => {
          const data = res.data
          setUserId(data.id)
        })
        .catch(error => {
          const res = error.response.data
          console.log(res)
          history.push('./error')
        })
    }
    checkResetValidation()
  }, [])

  useEffect(() => {
    function downHandler({ key }) {
      if (key === "Enter") {
        handleUpdatePassword()
      }
    }
    window.addEventListener('keydown', downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [handleUpdatePassword]);

  return (
    <div className={classes.root}>
      <Container maxWidth="xs" className={classes.container}>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item className={classes.gridItem}>
            <img src={Logo} alt="logo" height="100px" />
          </Grid>
          <Grid item className={classes.gridItem}>
            <h3>Reset Password</h3>
          </Grid>
          <Grid item className={classes.gridItem}>
            <TextField
              className={classes.textField}
              label="New Password"
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
                </InputAdornment>
              }}
            />
          </Grid>
          <Grid item className={classes.gridItem}>
            <Button className={classes.button} variant="contained" color="primary" onClick={handleUpdatePassword} disabled={disableUpdatePassword}>
              Update Password
            {isLoading && <CircularProgress style={{ color: 'white', marginLeft: "10px" }} size={15} />}
            </Button>
          </Grid>

          {updated.value &&
            <>
              <Grid item className={classes.gridItem}>
                <p style={{ color: 'green' }}>{updated.message}</p>
              </Grid>
              <Grid item className={classes.gridItem}>
                <Button className={classes.button} variant="outlined" color="primary" component={Link} to="/login">
                  Proceed to login
              </Button>
              </Grid>
            </>
          }
        </Grid>
      </Container>
    </div>
  )
}

export default Reset