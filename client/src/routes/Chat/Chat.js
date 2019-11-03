import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import styles from "./Chat.module.css";
import Channel from "../../components/Channel";
import Message from "../../components/Message";
import ChatForm from "../../components/ChatForm";
import User from "../../components/User";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import ChannelModal from "../../components/ChannelModal";

const Chat = ({
  fetchChannels,
  receiveChannel,
  channel,
  receiveMessages,
  receiveMessage,
  switchChannel,
  receiveUsers,
  receiveUser,
  removeUser,
  logout,
  messages,
  user
}) => {
  const [loading, setLoading] = useState(true);
  const [channelModal, setChannelModal] = useState(false);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");

  const ws = useRef(null);
  const messagesEnd = useRef(null);
  const selectedChannel = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4041");
    socket.onopen = () => {
      ws.current = socket;
      fetchChannels(setLoading);
      socket.send(
        JSON.stringify({
          action: "join-channel",
          channel: "Lobby",
          user: { id: user.session.id, name: user.session.name }
        })
      );
      setConnected(true);
    };

    socket.onmessage = e => {
      const data = JSON.parse(e.data);
      switch (data.action) {
        case "receive-channel":
          receiveChannel(data.channel);
          break;
        case "receive-messages":
          receiveMessages(data.messages);
          break;
        case "receive-message":
          receiveMessage(data.message);
          break;
        case "receive-users":
          receiveUsers(data.users);
          break;
        case "receive-user":
          receiveUser(data.user);
          break;
        case "user-left":
          removeUser(data.user_id);
          break;
        default:
          return;
      }
    };

    // Before every page refresh, leave the channel
    window.onbeforeunload = () => {
      console.log("Before Refresh", channel.current.name);
      socket.send(
        JSON.stringify({
          action: "leave-channel",
          channel: selectedChannel.current.name
        })
      );
      ws.current.close();
    };

    return () => {
      // On chat unmount leave the channel
      socket.send(
        JSON.stringify({
          action: "leave-channel",
          channel: selectedChannel.current.name
        })
      );
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (connected) {
      ws.current.send(
        JSON.stringify({
          action: "fetch-messages",
          channel_id: channel.current.id
        })
      );
    }
    selectedChannel.current = channel.current;
  }, [connected, channel.current]);

  const scrolltoBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!loading) {
      scrolltoBottom();
    }
  }, [loading, messages]);

  const toggleChannel = () => setChannelModal(!channelModal);

  const handleSwitchChannel = newChannel => () => {
    const currentChannel = channel.current;
    if (newChannel.name === currentChannel.name) {
      return;
    }
    console.log("CurrentChannel:", currentChannel);
    console.log("NewChannel:", newChannel);
    ws.current.send(
      JSON.stringify({
        action: "switch-channel",
        channel: newChannel,
        currentChannel,
        user: { id: user.session.id, name: user.session.name }
      })
    );
    switchChannel(newChannel);
  };

  const handleSubmit = e => {
    e.preventDefault();

    ws.current.send(
      JSON.stringify({
        action: "send-message",
        channel_name: channel.current.name,
        message: {
          channel_id: channel.current.id,
          text: message
        }
      })
    );
    setMessage("");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.chat}>
      <div className={styles.chat__channels}>
        {channel.all.map(c => (
          <Channel key={c.id} label={c.name} onClick={handleSwitchChannel(c)} />
        ))}
      </div>
      <div className={styles.chat__controls}>
        <Button
          label="Add Channel"
          className={styles.control__button}
          onClick={toggleChannel}
        />
        <ChannelModal
          open={channelModal}
          toggle={toggleChannel}
          ws={ws.current}
        />
        <Button
          label="Log Out"
          className={styles.control__button}
          onClick={logout}
        />
      </div>
      <div className={styles.chat__messages}>
        {messages.map(message => (
          <Message
            key={message.id}
            user={message.name}
            text={message.text}
            time={message.created_at}
          />
        ))}
        <div ref={messagesEnd} style={{ margin: "0" }} />
      </div>
      <div className={styles.chat__form}>
        <ChatForm
          value={message}
          onChange={e => setMessage(e.target.value)}
          onSubmit={handleSubmit}
        />
      </div>
      <div className={styles.chat__users}>
        {user.channel.map(u => (
          <User key={u.id} name={u.name} />
        ))}
      </div>
    </div>
  );
};

Chat.propTypes = {
  fetchChannels: PropTypes.func.isRequired
};

export default Chat;
