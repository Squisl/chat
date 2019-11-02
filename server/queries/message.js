const database = require("../database");

const common = require("./common");

const read = async () => {
  try {
    const result = await database
      .table("messages")
      .select(
        "messages.id",
        "users.name",
        "messages.channel_id",
        "messages.text",
        "messages.created_at"
      )
      .leftJoin("users", "users.id", "messages.user_id");
    return result;
  } catch (e) {
    console.error(e);
  }
};

const create = async data => {
  try {
    const newData = await database.table("messages").insert(data, "*");
    const message = newData[0];
    console.log("new Data:", newData);
    const result = await database
      .table("users")
      .select("name")
      .where({ id: message.user_id });
    const { user_id, ...messageWithoutUserId } = message;
    const newMessage = {
      ...messageWithoutUserId,
      name: result[0].name
    };
    return newMessage;
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  ...common("messages"),
  read,
  create
};
