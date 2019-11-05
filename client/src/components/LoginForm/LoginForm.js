import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import styles from "./LoginForm.module.css";
import FormInput from "../FormInput";
import Button from "../Button";
import { loginValidation } from "../../utilities/validation";
import NotificationMessage from "../NotificationMessage";

const LoginForm = ({ login, history, error, receiveError, clearError }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    return () => {
      clearError();
    };
  }, []);

  const update = fn => e => fn(e.target.value);

  const handleSubmit = e => {
    e.preventDefault();
    const data = {
      name,
      password
    };
    const { errors, valid } = loginValidation(data);
    if (valid) {
      login(data, history);
    } else {
      receiveError(errors);
    }
  };

  return (
    <form className={styles.login__form} onSubmit={handleSubmit}>
      {error.msg && (
        <NotificationMessage color="var(--light-red)" message={error.msg} />
      )}
      <FormInput
        label="Name"
        value={name}
        onChange={update(setName)}
        error={error.name}
      />
      <FormInput
        label="Password"
        type="password"
        value={password}
        onChange={update(setPassword)}
        error={error.password}
      />
      <Button
        label="Log In"
        type="submit"
        className={styles.login__form__button}
      />
    </form>
  );
};

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(LoginForm);
