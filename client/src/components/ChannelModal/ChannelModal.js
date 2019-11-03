import React, { useState } from "react";
import PropTypes from "prop-types";

import styles from "./ChannelModal.module.css";
import Modal from "../Modal";
import FormInput from "../FormInput";
import Button from "../Button";

const ChannelModal = ({ open, toggle, ws }) => {
  const [name, setName] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    ws.send(JSON.stringify({ action: "create-channel", channel: { name } }));
  };

  const update = fn => e => fn(e.target.value);

  return (
    <Modal open={open} toggle={toggle}>
      <form className={styles.channel__form} onSubmit={handleSubmit}>
        <FormInput label="Name" value={name} onChange={update(setName)} />
        <Button label="Add Channel" />
      </form>
    </Modal>
  );
};

ChannelModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  ws: PropTypes.object.isRequired
};

export default ChannelModal;
