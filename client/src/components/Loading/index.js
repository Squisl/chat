import React from "react";

import styles from "./styles.module.css";

const Loading = () => (
  <div className={styles.loading__container}>
    <div className={styles.loading}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

export default Loading;
