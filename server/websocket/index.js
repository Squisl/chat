const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

const { createChannel, establishChannels } = require("../services/channel");
const { message, channel } = require("../queries");

const startSocket = server => {
  const wss = new WebSocket.Server({
    server: server,
    verifyClient: async ({ req }, done) => {
      // Check whether we have a valid refresh token
      const token = req.headers.cookie.split("=")[1];
      if (!token) {
        return done(false, 401, "No token found");
      }
      const decoded = await jwt.verify(token, process.env.REFRESH_SECRET);
      if (!decoded) {
        return done(false, 403, "Not valid token");
      }
      req.jwt = decoded;
      done(true);
    }
  });

  let channels;
  (async () => {
    channels = await establishChannels();
  })();

  wss.on("connection", (ws, req) => {
    // Each key is a channel and the corresponding value is an array of websocket connections

    const { jwt } = req;
    ws.on("message", async data => {
      data = JSON.parse(data);
      switch (data.action) {
        case "join-channel":
          channels[data.channel] = channels[data.channel].concat({
            user: data.user,
            ws
          });
          // Send list of users in the channel
          ws.send(
            JSON.stringify({
              action: "receive-users",
              users: channels[data.channel].map(user => user.user)
            })
          );
          // Send to each user in the channel the joined user
          channels[data.channel].forEach(connection => {
            if (connection.user.id === jwt.id) {
              return;
            }
            connection.ws.send(
              JSON.stringify({ action: "receive-user", user: data.user })
            );
          });
          break;
        case "leave-channel":
          channels[data.channel] = channels[data.channel].filter(
            user => user.user.id !== jwt.id
          );
          // TODO: Tell all users in the channel that the user left
          channels[data.channel].forEach(connection => {
            connection.ws.send(
              JSON.stringify({ action: "user-left", user_id: jwt.id })
            );
          });
          break;
        case "create-channel":
          const newChannel = await createChannel({
            ...data.channel,
            user_id: jwt.id
          });
          // Send to all users of the chat the new channel
          for (let key of Object.keys(channels)) {
            channels[key].forEach(connection =>
              connection.ws.send(
                JSON.stringify({
                  action: "receive-channel",
                  channel: newChannel
                })
              )
            );
          }
          break;
        case "fetch-messages":
          const messages = await message.read({ channel_id: data.channel_id });
          ws.send(JSON.stringify({ action: "receive-messages", messages }));
          break;
        case "send-message":
          const newMessage = await message.create({
            ...data.message,
            user_id: jwt.id
          });
          channels[data.channel_name].forEach(user => {
            user.ws.send(
              JSON.stringify({ action: "receive-message", message: newMessage })
            );
          });
          break;
        case "switch-channel":
          // Remove user from the old channel
          channels[data.currentChannel.name] = channels[
            data.currentChannel.name
          ].filter(user => user.user.id !== jwt.id);
          // TODO: Tell all user in the old channel that I left
          channels[data.currentChannel.name].forEach(connection => {
            connection.ws.send(
              JSON.stringify({ action: "user-left", user_id: jwt.id })
            );
          });
          // Add user to the new channel
          channels[data.channel.name] = channels[data.channel.name].concat({
            user: data.user,
            ws
          });
          // Tell all user in the new channel i joined
          channels[data.channel.name].forEach(connection => {
            if (connection.user.id === jwt.id) {
              return;
            }
            connection.ws.send(
              JSON.stringify({ action: "receive-user", user: data.user })
            );
          });
          // Send list of users in the channel
          ws.send(
            JSON.stringify({
              action: "receive-users",
              users: channels[data.channel.name].map(user => user.user)
            })
          );
          console.log("Channels:", channels);
          break;
        case "update-channel":
          // TODO: Check if channel name is already taken
          const result = await channel.read({ name: data.channel.name });
          if (result.length > 0) {
            ws.send(
              JSON.stringify({
                action: "receive-channel-update",
                error: "Channel name already taken"
              })
            );
          } else {
            const updatedChannel = await channel.update(
              { id: data.channel.id },
              data.channel
            );
            ws.send(
              JSON.stringify({
                action: "receive-channel-update",
                channel: updatedChannel
              })
            );
          }
      }
    });
  });
};

module.exports = startSocket;
