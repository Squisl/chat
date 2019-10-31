import React from "react";
import { connect } from "react-redux";
import { withRouter, Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authenticated ? <Component {...props} /> : <Redirect to="/" />
    }
  />
);

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

export default withRouter(connect(mapStateToProps)(ProtectedRoute));
