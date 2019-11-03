import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import styles from "./ChannelSettingsModal.module.css";
import Modal from "../Modal";
import FormInput from "../FormInput";
import Button from "../Button";

const ChannelSettingsModal = ({ channel, toggle, open }) => {
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (channel) {
      setName(channel.name);
    }
  }, [channel]);

  const update = fn => e => fn(e.target.value);

  const handleSubmit = e => {
    e.preventDefault();
    if (name.trim().length === 0) {
      setError("Name must be at least 2 characters");
      return;
    }
    if (name.trim().length > 20) {
      setError("Name must be less than 20 characters");
      return;
    }
  };

  return (
    <Modal open={open} toggle={toggle}>
      <form className={styles.settings__modal} onSubmit={handleSubmit}>
        <span className={styles.settings__modal__header}>Channel Settings</span>
        <FormInput
          label="Name"
          value={name}
          onChange={update(setName)}
          error={error}
        />
        <Button
          label="Save"
          type="submit"
          className={styles.settings__modal__button}
        />
      </form>
    </Modal>
  );
};

ChannelSettingsModal.propTypes = {};

export default ChannelSettingsModal;
