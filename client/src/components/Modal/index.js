import React from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { FaRegWindowClose } from "react-icons/fa";

import styles from "./styles.module.css";

const Modal = ({ children, open, toggle }) =>
  open
    ? createPortal(
        <div className={styles.modal__overlay}>
          <div className={styles.modal}>
            <div className={styles.modal__header}>
              <button className={styles.modal__header__close} onClick={toggle}>
                <FaRegWindowClose className={styles.close__icon} />
              </button>
            </div>
            <div className={styles.modal__content}>{children}</div>
          </div>
        </div>,
        document.body
      )
    : null;

Modal.propTypes = {
  children: PropTypes.node.isRequired
};

export default Modal;
