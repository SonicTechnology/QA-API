const Pool = require('pg-promise')();
require('dotenv').config();

const db = Pool({
  user: 'ubuntu',
  // user: 'andrewihn',
  host: '3.84.12.181',
  // host: 'ec2-18-206-125-213.compute-1.amazonaws.com',
  database: 'test',
  password: 'pw',
  port: 5432,
});

module.exports = db;
