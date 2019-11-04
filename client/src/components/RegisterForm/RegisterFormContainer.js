import { connect } from "react-redux";

import RegisterForm from "./RegisterForm";
import { register } from "../../modules/user";
import { receiveError, clearError } from "../../modules/error";

const mapStateToProps = state => ({
  error: state.error
});

const mapDispatchToProps = { register, receiveError, clearError };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterForm);
