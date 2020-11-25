import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';

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

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            PIGture
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      {props.children}
    </div>
  )
}

export default Standard
