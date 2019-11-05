import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.css";
import { FaCog } from "react-icons/fa";

const Channel = ({ session, channel, onClick, toggleModal, selected }) => (
  <div
    onClick={onClick}
    className={`${styles.channel} ${selected && styles.channel_selected}`}
  >
    <span className={styles.channel__name}>{channel.name}</span>
    {session.id === channel.user_id ? (
      <FaCog onClick={toggleModal(channel)} />
    ) : (
      <div style={{ width: "16px" }}></div>
    )}
  </div>
);

Channel.propTypes = {
  session: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired
};

export default Channel;
