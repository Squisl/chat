const database = require("../database");
const common = require("./common");

const readAll = async () => {
  try {
    const response = await database
      .table("channels")
      .select()
      .orderBy("name", "asc");
    return response;
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  ...common("channels"),
  readAll
};
