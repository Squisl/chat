import React from "react"
import PropTypes from "prop-types"

import styles from "./styles.module.css"

const Button = ({label, className, onClick, type}) => (
  <button
    className={`${styles.button} ${className ? className : ""}`}
    onClick={onClick}
    type={type}>
    {label}
  </button>
)

Button.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
}

export default Button
