import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom';

import {
  AppBar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography
} from '@material-ui/core';

import DashboardIcon from '@material-ui/icons/Dashboard'
import AccountCircle from '@material-ui/icons/AccountCircle';

import { AiOutlineScan } from 'react-icons/ai';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    color: '#6699cc',
    backgroundColor: 'white',
    boxShadow: 'none',
    borderBottomStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#6699cc'
  },
  menuButton: {
    marginRight: '4px',
  },
  title: {
    flexGrow: 1,
  },
}))

function Standard(props) {
  const classes = useStyles()
  const login = localStorage.getItem('token')

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Flyer Garden
          </Typography>
          <Tooltip arrow title={login ? "Dashboard" : "Login"} placement="bottom">
            <IconButton color="inherit" component={Link} to="/login">
              {login ? <DashboardIcon /> : <AccountCircle />}
            </IconButton>
          </Tooltip>
          <Tooltip arrow title="Scan QR code" placement="bottom">
            <IconButton color="inherit" component={Link} to="/qrcode-scanner"><AiOutlineScan /></IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      {props.children}
    </div>
  )
}

export default Standard
