const { channel } = require("../queries");

const readChannels = async () => {
  try {
    const result = await channel.readAll();
    return result;
  } catch (e) {
    console.error(e);
  }
};

const establishChannels = async () => {
  try {
    const result = await readChannels();
    const temp = result.reduce((acc, curr) => {
      acc[curr.name] = [];
      return acc;
    }, {});
    return temp;
  } catch (e) {
    console.error(e);
  }
};

const createChannel = async data => {
  try {
    const result = await channel.create(data);
    return result;
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  readChannels,
  establishChannels,
  createChannel
};
