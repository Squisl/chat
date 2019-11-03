import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.css";
import { FaCog } from "react-icons/fa";

const Channel = ({ session, channel, onClick, toggleModal }) => (
  <div onClick={onClick} className={styles.channel}>
    <span className={styles.channel__name}>{channel.name}</span>
    {session.id === channel.user_id && <FaCog onClick={toggleModal(channel)} />}
  </div>
);

Channel.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired
};

export default Channel;
