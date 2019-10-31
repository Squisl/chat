import { connect } from "react-redux";

import RegisterForm from "./RegisterForm";
import { register } from "../../modules/user";

const mapStateToProps = state => ({});

const mapDispatchToProps = { register };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterForm);
