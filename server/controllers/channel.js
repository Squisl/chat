const { channel } = require("../queries");

const readAll = async (req, res) => {
  const channels = await channel.readAll();
  res.send(channels);
};

module.exports = {
  readAll
};
