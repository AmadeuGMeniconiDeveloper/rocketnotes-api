const path = require("path");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

async function sqliteConnection() {
  const db = await sqlite.open({
    filename: path.resolve(__dirname, "..", "database.db"),
    driver: sqlite3.Database,
  });

  return db;
}

module.exports = sqliteConnection;
