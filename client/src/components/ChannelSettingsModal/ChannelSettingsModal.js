import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import styles from "./ChannelSettingsModal.module.css";
import Modal from "../Modal";
import FormInput from "../FormInput";
import Button from "../Button";
import { channelValidation } from "../../utilities/validation";

const ChannelSettingsModal = ({ channel, toggle, open }) => {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (channel) {
      setName(channel.name);
    }
  }, [channel]);

  const update = fn => e => fn(e.target.value);

  const handleSubmit = e => {
    e.preventDefault();
    const validation = channelValidation({ name });
    if (validation.valid) {
      // TODO: Send to server and validate name is not taken.
      if (Object.keys(errors).length > 0) {
        setErrors({});
      }
    } else {
      setErrors(validation.errors);
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
          error={errors.name}
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

ChannelSettingsModal.propTypes = {
  channel: PropTypes.object,
  toggle: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default ChannelSettingsModal;
