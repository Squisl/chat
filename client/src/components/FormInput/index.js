import React from "react";
import PropTypes from "prop-types";

import styles from "./styles.module.css";

const FormInput = ({ type, value, onChange, label, error }) => (
  <div className={styles.form__input}>
    <label htmlFor={label} className={styles.input__label}>
      {label}
    </label>
    <input
      className={`${styles.input} ${error ? styles.error : ""}`}
      type={type}
      value={value}
      onChange={onChange}
    />
    {error && <span className={styles.input__error}>{error}</span>}
  </div>
);

FormInput.propTypes = {
  type: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default FormInput;
