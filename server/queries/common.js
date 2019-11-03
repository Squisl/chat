const database = require("../database");

const create = table => async data => {
  try {
    const newData = await database.table(table).insert(data, "*");
    return newData[0];
  } catch (e) {
    console.error(e);
  }
};

const read = table => async criteria => {
  try {
    const data = await database
      .table(table)
      .select()
      .where(criteria);
    return data;
  } catch (e) {
    console.error(e);
  }
};

const update = table => async (criteria, data) => {
  try {
    const updatedData = await database
      .table(table)
      .update(data, "*")
      .where(criteria);
    return updatedData;
  } catch (e) {
    console.error(e);
  }
};

const del = table => async criteria => {
  try {
    const deletedData = await database
      .table(table)
      .del()
      .where(criteria)
      .returning("*");
    return deletedData;
  } catch (e) {
    console.error(e);
  }
};

module.exports = table => ({
  create: create(table),
  read: read(table),
  update: update(table),
  del: del(table)
});
