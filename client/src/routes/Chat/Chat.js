import React from "react";
import PropTypes from "prop-types";

import styles from "./Chat.module.css";

const Chat = props => {
  return (
    <div className={styles.chat}>
      <span>Chat</span>
    </div>
  );
};

Chat.propTypes = {};

export default Chat;
