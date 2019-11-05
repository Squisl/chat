import React from "react";
import { FiMessageSquare } from "react-icons/fi";

import styles from "./styles.module.css";

const NoMessages = () => {
  return (
    <div className={styles.no__messages__container}>
      <div className={styles.no__messages}>
        <FiMessageSquare className={styles.no__messages__icon} />
        <span className={styles.no__messages__description}>No Messages</span>
      </div>
    </div>
  );
};

NoMessages.propTypes = {};

export default NoMessages;
