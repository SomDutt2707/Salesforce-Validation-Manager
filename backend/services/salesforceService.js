const jsforce = require("jsforce");

let conn = null;

function setConnection(connection) {
  conn = connection;
}

function getConnection() {
  return conn;
}

module.exports = {
  setConnection,
  getConnection,
};
