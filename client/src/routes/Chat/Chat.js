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
  messages
}) => {
  const [loading, setLoading] = useState(true);
  const [channelModal, setChannelModal] = useState(false);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");

  const ws = useRef(null);

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
      ws.close();
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

  const toggleChannel = () => setChannelModal(!channelModal);

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
          <Channel key={c.id} label={c.name} />
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
