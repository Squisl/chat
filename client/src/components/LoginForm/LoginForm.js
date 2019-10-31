import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import styles from "./LoginForm.module.css";
import FormInput from "../FormInput";
import Button from "../Button";

const LoginForm = ({ login, history }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const update = fn => e => fn(e.target.value);

  const handleSubmit = e => {
    e.preventDefault();

    login({ name, password }, history);
  };

  return (
    <form className={styles.login__form} onSubmit={handleSubmit}>
      <FormInput label="Name" value={name} onChange={update(setName)} />
      <FormInput
        label="Password"
        type="password"
        value={password}
        onChange={update(setPassword)}
      />
      <Button
        label="Log In"
        type="submit"
        className={styles.login__form__button}
      />
    </form>
  );
};

LoginForm.propTypes = {};

export default withRouter(LoginForm);
