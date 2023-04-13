const Pool = require('pg-promise')();
require('dotenv').config();

const db = Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDB,
  password: process.env.PGPW,
  port: process.env.PGPORT,
});

module.exports = db;
