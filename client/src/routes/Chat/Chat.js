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
  messages
}) => {
  const [loading, setLoading] = useState(true);
  const [channelModal, setChannelModal] = useState(false);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");

  const ws = useRef(null);
  const messagesEnd = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4041");
    socket.onopen = () => {
      ws.current = socket;
      socket.send(JSON.stringify({ action: "join-channel", channel: "Lobby" }));
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
      }
    };

    fetchChannels(setLoading);
    // Before every page refresh, leave the channel
    window.onbeforeunload = () => {
      socket.send(
        JSON.stringify({ action: "leave-channel", channel: "Lobby" })
      );
    };

    return () => {
      // On chat unmount leave the channel
      socket.send(
        JSON.stringify({ action: "leave-channel", channel: "Lobby" })
      );
      ws.close();
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
    ws.current.send(
      JSON.stringify({
        action: "switch-channel",
        channel: newChannel,
        currentChannel
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
        <Button label="Log Out" className={styles.control__button} />
      </div>
      <div className={styles.chat__messages}>
        {messages.map(message => (
          <Message
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
        <User name="James" />
      </div>
    </div>
  );
};

Chat.propTypes = {
  fetchChannels: PropTypes.func.isRequired
};

export default Chat;
