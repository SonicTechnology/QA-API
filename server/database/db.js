const Pool = require('pg-promise')();
require('dotenv').config();

const db = Pool({
  user: 'andrewihn',
  host: 'ec2-54-89-22-195.compute-1.amazonaws.com',
  database: 'test',
  password: 'pw',
  port: 5432,
});

module.exports = db;
