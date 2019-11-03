import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import styles from "./RegisterForm.module.css";
import FormInput from "../FormInput";
import Button from "../Button";
import { registerValidation } from "../../utilities/validation";

const RegisterForm = ({ register, history }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

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

    if (valid) {
      register(data, history);
    } else {
      setErrors(errors);
    }
  };

  return (
    <form className={styles.register__form} onSubmit={handleSubmit}>
      <FormInput
        label="Email"
        value={email}
        onChange={update(setEmail)}
        error={errors.email}
      />
      <FormInput
        label="Name"
        value={name}
        onChange={update(setName)}
        error={errors.name}
      />
      <FormInput
        label="Password"
        value={password}
        onChange={update(setPassword)}
        type="password"
        error={errors.password}
      />
      <FormInput
        label="Confirm Password"
        value={confirmPassword}
        onChange={update(setConfirmPassword)}
        type="password"
        error={errors.confirmPassword}
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
