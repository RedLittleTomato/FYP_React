import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import { Blank, Standard } from './layout'
import { Dashboard, Home, Login, ForgotPassword, Error, Preview, Register, ResetPassword, Flyer, QRcodeScanner } from './pages';


const AppRoute = ({ component: Component, layout: Layout, path, ...rest }) => {
  const withoutAuth = [Error, ForgotPassword, Home, Preview, QRcodeScanner, Register, ResetPassword]
  const logged = (!localStorage.token && !withoutAuth.includes(Component))

  return (
    <Route {...rest} render={props => (
      <Layout>
        {logged && <Redirect to="/login" />}
        <Component {...props}></Component>
      </Layout>
    )}></Route>
  )
}

function App() {
  return (
    <>
      <Router>
        <Switch>
          <AppRoute exact path="/">
            <Redirect to="/login" />
          </AppRoute>
          <AppRoute exact path="/login" layout={Standard} component={Login} />
          <AppRoute exact path="/register" layout={Standard} component={Register} />
          <AppRoute exact path="/error" layout={Blank} component={Error} />
          <AppRoute exact path="/forgot-password" layout={Standard} component={ForgotPassword} />
          <AppRoute path="/reset-password" layout={Standard} component={ResetPassword} />
          <AppRoute exact path="/dashboard" layout={Blank} component={Dashboard} />
          <AppRoute exact path="/preview" layout={Standard} component={Preview} />
          <AppRoute exact path="/e-flyer" layout={Blank} component={Flyer} />
          <AppRoute exact path="/qrcode-scanner" layout={Standard} component={QRcodeScanner} />
          <AppRoute exact insecure>
            <Redirect to="/error" />
          </AppRoute>
        </Switch>
      </Router>
    </>
  );
}

export default App;
