import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.css";

const NotificationMessage = ({ message, color }) => (
  <div className={styles.notification__container} style={{ background: color }}>
    <span className={styles.notification__message}>{message}</span>
  </div>
);

NotificationMessage.propTypes = {
  message: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
};

export default NotificationMessage;
