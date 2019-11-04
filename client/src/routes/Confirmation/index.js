import React, { useEffect } from "react";
import PropTypes from "prop-types";

import styles from "./styles.module.css";
import fetchAPI from "../../utilities/fetchAPI";
import Loading from "../../components/Loading";

const Confirmation = ({ match }) => {
  useEffect(() => {
    const { token } = match.params;
    if (!token) return;
    const confirm = async () => {
      const response = await fetchAPI(`/api/user/confirmation/${token}`);
      return response;
    };
    confirm();
  }, []);

  return (
    <div>
      <Loading />
    </div>
  );
};

Confirmation.propTypes = {
  match: PropTypes.object
};

export default Confirmation;
