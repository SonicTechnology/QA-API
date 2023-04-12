const Pool = require('pg-promise')();

const db = Pool({
  database: 'test',
  port: 5432,
});

module.exports = db;
