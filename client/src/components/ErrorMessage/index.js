import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.css";

const ErrorMessage = ({ message }) => (
  <div className={styles.error__container}>
    <span className={styles.error__message}>{message}</span>
  </div>
);

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired
};

export default ErrorMessage;
