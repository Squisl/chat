import { connect } from "react-redux";

import LoginForm from "./LoginForm";
import { login } from "../../modules/user";

const mapStateToProps = state => ({});

const mapDispatchToProps = { login };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm);
