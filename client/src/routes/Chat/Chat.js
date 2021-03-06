import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import styles from "./Chat.module.css";
import Channel from "../../components/Channel";
import Message from "../../components/Message";
import ChatForm from "../../components/ChatForm";
import User from "../../components/User";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import AddChannelModal from "../../components/AddChannelModal";
import ChannelSettingsModal from "../../components/ChannelSettingsModal/ChannelSettingsModal";
import NoMessages from "../../components/NoMessages";

const Chat = ({
  fetchChannels,
  receiveChannel,
  updateChannel,
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
  const [openAddChannel, setOpenAddChannel] = useState(false);
  const [openChannelSettings, setOpenChannelSettings] = useState(false);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [clickedChannel, setClickedChannel] = useState(null);

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
        case "receive-channel-update":
          if (data.channel) {
            updateChannel(data.channel);
          }
          break;
        default:
          return;
      }
    };

    // Before every page refresh, leave the channel
    window.onbeforeunload = () => {
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

  const toggleAddChannel = () => setOpenAddChannel(!openAddChannel);

  const toggleChannelSettings = channel => e => {
    e.stopPropagation();
    if (channel) {
      setClickedChannel(channel);
    }
    setOpenChannelSettings(!openChannelSettings);
  };

  const handleSwitchChannel = newChannel => () => {
    const currentChannel = channel.current;
    if (newChannel.name === currentChannel.name) {
      return;
    }
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
    if (message.trim().length === 0) return;
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
      <ChannelSettingsModal
        toggle={toggleChannelSettings()}
        open={openChannelSettings}
        channel={clickedChannel}
        ws={ws.current}
      />
      <div className={styles.chat__channels}>
        {channel.all.map(c => (
          <Channel
            key={c.id}
            selected={channel.current.id === c.id}
            session={user.session}
            channel={c}
            onClick={handleSwitchChannel(c)}
            toggleModal={toggleChannelSettings}
          />
        ))}
      </div>
      <div className={styles.chat__controls}>
        <Button
          label="Add Channel"
          className={styles.control__button}
          onClick={toggleAddChannel}
        />
        <AddChannelModal
          open={openAddChannel}
          toggle={toggleAddChannel}
          ws={ws.current}
        />
        <Button
          label="Log Out"
          className={styles.control__button}
          onClick={logout}
        />
      </div>
      <div className={styles.chat__messages}>
        {messages.length > 0 ? (
          messages.map(message => (
            <Message
              key={message.id}
              user={message.name}
              text={message.text}
              time={message.created_at}
            />
          ))
        ) : (
          <NoMessages />
        )}
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
          <User key={u.name} name={u.name} />
        ))}
      </div>
    </div>
  );
};

Chat.propTypes = {
  fetchChannels: PropTypes.func.isRequired
};

export default Chat;
