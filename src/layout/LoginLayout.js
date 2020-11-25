import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
  },
}));

function LoginLayout(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h1>Login Layout</h1>
      {props.children}
    </div>
  )
}

export default LoginLayout;
