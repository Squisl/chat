import React from "react"
import PropTypes from "prop-types"

import styles from "./styles.module.css"

const FormInput = ({label, type, value, onChange, className}) => (
  <div className={styles.input__container}>
    <label htmlFor={label} className={styles.input__label}>
      {label}
    </label>
    <input
      id={label}
      type={type}
      value={value}
      onChange={onChange}
      className={`${styles.input} ${className ? className : ""}`}
    />
  </div>
)
FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default FormInput
