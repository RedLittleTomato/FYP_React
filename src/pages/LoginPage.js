import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Login } from '../components'

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#f5f5f6',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
}))

function LoginPage() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Login />
    </div>
  )
}

export default LoginPage;