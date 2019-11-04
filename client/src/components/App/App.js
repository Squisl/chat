import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Route } from "react-router-dom";

import styles from "./App.module.css";
import Home from "../../routes/Home";
import Chat from "../../routes/Chat";
import Loading from "../Loading";
import ProtectedRoute from "../../hoc/ProtectedRoute";
import AuthenticatedRoute from "../../hoc/AuthenticatedRoute";
import Confirmation from "../../routes/Confirmation";

const App = ({ loadUser }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadUser(setLoading);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.app}>
      <BrowserRouter>
        <AuthenticatedRoute exact path={["/", "/register"]} component={Home} />
        <ProtectedRoute path="/chat" component={Chat} />
        <Route path="/confirmation/:token" component={Confirmation} />
      </BrowserRouter>
    </div>
  );
};

App.propTypes = {
  loadUser: PropTypes.func.isRequired
};

export default App;
