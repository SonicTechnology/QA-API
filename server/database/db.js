const Pool = require('pg-promise')();
require('dotenv').config();

// const db = Pool({
//   user: 'andrewihn',
//   host: 'localhost',
//   database: 'test',
//   port: 5432,
// });

const db = Pool({
  user: 'ubuntu',
  host: '54.161.194.23',
  database: 'test',
  password: 'pw',
  port: 5432,
});

module.exports = db;
