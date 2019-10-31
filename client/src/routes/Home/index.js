import React from "react"
import PropTypes from "prop-types"
import {Route} from "react-router-dom"

import styles from "./styles.module.css"
import LoginForm from "../../components/LoginForm"

const Home = () => {
  return (
    <div className={styles.home}>
      <LoginForm />
      <video className="VideoTag" autoPlay loop muted>
        <source src="../../assets/videos/space.mp4" type="video/mp4" />
      </video>
    </div>
  )
}

Home.propTypes = {}

export default Home
