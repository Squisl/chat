import React from "react";
import PropTypes from "prop-types";

import styles from "./styles.module.css";

const User = ({ image, name }) => {
  return (
    <div className={styles.user}>
      <img
        src="https://via.placeholder.com/150"
        alt="profile"
        className={styles.user__image}
      />
      <span className={styles.user__name}>{name}</span>
    </div>
  );
};

User.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default User;
