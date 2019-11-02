const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

const { createChannel, establishChannels } = require("../services/channel");
const { message } = require("../queries");

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
    console.log("Channels:", channels);
    // Each key is a channel and the corresponding value is an array of websocket connections

    const { jwt } = req;
    ws.on("message", async data => {
      data = JSON.parse(data);
      console.log("data:", data);
      switch (data.action) {
        case "join-channel":
          channels[data.channel] = channels[data.channel].concat({
            user_id: jwt.id,
            ws
          });
          console.log("Join channel:", channels);
          break;
        case "leave-channel":
          console.log("Yes:", data);
          channels[data.channel] = channels[data.channel].filter(
            user => user.user_id !== jwt.id
          );
          break;
        case "create-channel":
          const newChannel = await createChannel({
            ...data.channel,
            user_id: jwt.id
          });

          ws.send(
            JSON.stringify({ action: "receive-channel", channel: newChannel })
          );
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
          console.log("New Message:", newMessage);
          console.log("Chann:", channels);
          console.log("Lobby:", channels[data.channel_name]);
          channels[data.channel_name].forEach(user => {
            if (user.user_id === jwt.id) {
              return;
            }
            user.ws.send(
              JSON.stringify({ action: "receive-message", message: newMessage })
            );
          });
          break;
      }
    });
  });
};

module.exports = startSocket;
