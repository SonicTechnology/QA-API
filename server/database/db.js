import dbPool from 'dbPool.js';
import postgres from 'postgres';

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  database: 'qa',
  password: '2302sdcqa',
  port: 5432,
});

export default dbPool;
