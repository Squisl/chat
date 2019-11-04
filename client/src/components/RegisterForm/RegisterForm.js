import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import styles from "./RegisterForm.module.css";
import FormInput from "../FormInput";
import Button from "../Button";
import { registerValidation } from "../../utilities/validation";

const RegisterForm = ({
  register,
  history,
  error,
  receiveError,
  clearError
}) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    return () => {
      clearError();
    };
  }, []);

  const update = fn => e => fn(e.target.value);

  const handleSubmit = e => {
    e.preventDefault();
    const data = {
      email,
      name,
      password,
      confirmPassword
    };
    const { errors, valid } = registerValidation(data);
    console.log("Register data:", data);
    console.log("Register errors:", errors);
    if (valid) {
      register(data, history);
    } else {
      receiveError(errors);
    }
  };

  return (
    <form className={styles.register__form} onSubmit={handleSubmit}>
      <FormInput
        label="Email"
        value={email}
        onChange={update(setEmail)}
        error={error.email}
      />
      <FormInput
        label="Name"
        value={name}
        onChange={update(setName)}
        error={error.name}
      />
      <FormInput
        label="Password"
        value={password}
        onChange={update(setPassword)}
        type="password"
        error={error.password}
      />
      <FormInput
        label="Confirm Password"
        value={confirmPassword}
        onChange={update(setConfirmPassword)}
        type="password"
        error={error.confirmPassword}
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
