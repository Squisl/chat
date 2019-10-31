const http = require("http");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const socketio = require("socket.io");

const routes = require("./routes");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

const port = process.env.PORT || 4041;
const start = port => {
  try {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (e) {
    console.error(e);
  }
};

start(port);