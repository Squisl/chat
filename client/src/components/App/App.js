import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Route } from "react-router-dom";

import styles from "./App.module.css";
import Home from "../../routes/Home";
import Chat from "../../routes/Chat";
import Loading from "../Loading";
import ProtectedRoute from "../../hoc/ProtectedRoute";

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
        <Route exact path={["/", "/register"]} component={Home} />
        <ProtectedRoute path="/chat" component={Chat} />
      </BrowserRouter>
    </div>
  );
};

App.propTypes = {};

export default App;
