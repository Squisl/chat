import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.css";

const Message = ({ user, text, time }) => {
  return (
    <div className={styles.message}>
      <span className={styles.message__user}>{user}</span>
      <span className={styles.message__text}>{text}</span>
      <span className={styles.message__time}>{time}</span>
    </div>
  );
};

Message.propTypes = {
  user: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired
};

export default Message;
