import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import styles from "./RegisterForm.module.css";
import FormInput from "../FormInput";
import Button from "../Button";

const RegisterForm = ({ register, history }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const update = fn => e => fn(e.target.value);

  const handleSubmit = e => {
    e.preventDefault();

    register(
      {
        email,
        name,
        password,
        confirmPassword
      },
      history
    );
  };

  return (
    <form className={styles.register__form} onSubmit={handleSubmit}>
      <FormInput label="Email" value={email} onChange={update(setEmail)} />
      <FormInput label="Name" value={name} onChange={update(setName)} />
      <FormInput
        label="Password"
        value={password}
        onChange={update(setPassword)}
        type="password"
      />
      <FormInput
        label="Confirm Password"
        value={confirmPassword}
        onChange={update(setConfirmPassword)}
        type="password"
      />
      <Button
        label="Register"
        type="submit"
        className={styles.register__form__button}
      />
    </form>
  );
};

RegisterForm.propTypes = {
  register: PropTypes.func.isRequired,
  history: PropTypes.func.isRequired
};

export default withRouter(RegisterForm);
