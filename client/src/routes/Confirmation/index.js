import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import styles from "./styles.module.css";
import fetchAPI from "../../utilities/fetchAPI";
import Loading from "../../components/Loading";
import NotificationMessage from "../../components/NotificationMessage";

const Confirmation = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const { token } = match.params;
    if (!token) return;
    const confirm = async () => {
      try {
        const response = await fetchAPI(`/api/user/confirmation/${token}`);
        setMessage(response.msg);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError(true);
        setMessage(e.msg);
        setLoading(false);
      }
    };
    confirm();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.confirmation__container}>
      <NotificationMessage
        color={error ? "var(--light-red)" : "green"}
        message={message}
      />
    </div>
  );
};

Confirmation.propTypes = {
  match: PropTypes.object
};

export default Confirmation;
