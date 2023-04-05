const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  database: 'qa',
  password: '2302sdcqa',
  port: 5432,
});

module.exports = dbPool;
