import { connect } from "react-redux";

import App from "./App";
import { loadUser } from "../../modules/user";

const mapStateToProps = state => ({});

const mapDispatchToProps = { loadUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
