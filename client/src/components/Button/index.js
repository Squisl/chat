import React from "react";
import PropTypes from "prop-types";

import styles from "./styles.module.css";

const Button = ({ label, onClick, type, className }) => (
  <button
    className={`${styles.button} ${className ? className : ""}`}
    onClick={onClick}
    type={type}
  >
    {label}
  </button>
);

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string.isRequired
};

export default Button;
