import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.css";

const Channel = ({ label, onClick }) => (
  <div onClick={onClick} className={styles.channel}>
    <span>{label}</span>
  </div>
);

Channel.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Channel;
