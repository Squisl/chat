import { connect } from "react-redux";

import LoginForm from "./LoginForm";
import { login } from "../../modules/user";
import { receiveError, clearError } from "../../modules/error";

const mapStateToProps = state => ({
  error: state.error
});

const mapDispatchToProps = { login, receiveError, clearError };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm);
