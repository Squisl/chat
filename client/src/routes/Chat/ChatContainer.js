import { connect } from "react-redux";

import Chat from "./Chat";
import {
  fetchChannels,
  receiveChannel,
  switchChannel
} from "../../modules/channel";
import { receiveMessages, receiveMessage } from "../../modules/message";
import { logout } from "../../modules/user";

const mapStateToProps = state => ({
  channel: state.channel,
  messages: state.message
});

const mapDispatchToProps = {
  fetchChannels,
  receiveChannel,
  receiveMessages,
  receiveMessage,
  switchChannel,
  logout
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);
