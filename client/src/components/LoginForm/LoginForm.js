import React, {useState} from "react"
import PropTypes from "prop-types"

import styles from "./LoginForm.module.css"
import FormInput from "../FormInput"
import Button from "../Button"

const LoginForm = ({}) => {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  const update = fn => e => fn(e.target.value)

  const handleSubmit = e => {
    e.preventDefault()
  }

  return (
    <div className={styles.login__form__container}>
      <p className={styles.login__form__title}>Log In</p>
      <form className={styles.login__form} onSubmit={handleSubmit}>
        <FormInput label="Name" value={name} onChange={update(setName)} />
        <FormInput
          type="password"
          label="Password"
          value={password}
          onChange={update(setPassword)}
        />
        <Button label="Log In" className={styles.login__form__button} />
      </form>
    </div>
  )
}

LoginForm.propTypes = {}

export default LoginForm
