import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.css";
import { IoIosSend } from "react-icons/io";

const ChatForm = ({ value, onChange, onSubmit }) => {
  return (
    <form className={styles.chat__form} onSubmit={onSubmit}>
      <input
        className={styles.chat__form__input}
        placeholder="Type something..."
        value={value}
        onChange={onChange}
      />
      <button className={styles.chat__form__button}>
        <IoIosSend className={styles.button__icon} />
      </button>
    </form>
  );
};

ChatForm.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ChatForm;
