import React from "react";
import { connect } from "react-redux";
import { withRouter, Route, Redirect } from "react-router-dom";

const AuthenticatedRoute = ({
  component: Component,
  authenticated,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      authenticated ? <Redirect to="/chat" /> : <Component {...props} />
    }
  />
);

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

export default withRouter(connect(mapStateToProps)(AuthenticatedRoute));
