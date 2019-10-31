import React from "react";
import { NavLink } from "react-router-dom";

import styles from "./styles.module.css";
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";

const Home = ({ match }) => {
  console.log("Match", match);
  return (
    <div className={styles.home}>
      <div className={styles.home__header}>
        <NavLink
          exact
          to="/"
          className={styles.home__window__link}
          activeClassName={styles.active}
        >
          Log In
        </NavLink>
        <NavLink
          to="/register"
          className={styles.home__window__link}
          activeClassName={styles.active}
        >
          Register
        </NavLink>
      </div>
      <div className={styles.home__window}>
        {match.path === "/" && <LoginForm />}
        {match.path === "/register" && <RegisterForm />}
      </div>
    </div>
  );
};

export default Home;
