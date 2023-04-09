const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
// require('dotenv').config();

const pool = new Pool({
  database: 'test',
  port: 5432,
});

// const Promise = require('bluebird');
// const initOptions = { promiseLib: Promise };
// const pgp = require('pg-promise')(initOptions);
// const pool = pgp({
//   port: 5432,
//   database: 'test',
// });

const csvQ = path.join(__dirname, '../../RawData/questions.csv');
const csvA = path.join(__dirname, '../../RawData/answers.csv');
const csvAP = path.join(__dirname, '../../RawData/answers_photos.csv');

const queryQCreate = `create table questions(
  id serial primary key,
  product_id integer not null,
  body text not null,
  date_written bigint not null,
  asker_name varchar(30) not null,
  asker_email varchar(50) not null,
  reported boolean not null default 'false',
  helpful integer not null default '0',
  answers json
);`

const queryACreate = `create table answers (
  id serial primary key,
  question_id integer not null,
  body text not null,
  date_written bigint not null,
  answerer_name varchar(50) not null,
  answerer_email varchar(100) not null,
  reported boolean not null default 'false',
  helpful integer not null default '0',
  photos json
);`

const queryAPCreate = `create table answers_photos (
  id serial primary key,
  answer_id integer not null,
  url text not null
)`


const queryQCopy = `copy questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful) from '${csvQ}' with (format csv, header true);`
const queryACopy = `copy answers(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful) from '${csvA}' with (format csv, header true);`
const queryAPCopy = `copy answers_photos(id, answer_id, url) from '${csvAP}' with (format csv, header true);`

const queryMax = (table) => {return `SELECT max(id) from ${table};`};
const queryQInc = (seq, max) => {return `ALTER SEQUENCE ${seq} RESTART WITH ${max};`};

// 2018-10-18T00:00:00.000Z
const queryQDate = (seq) => {return `ALTER TABLE ${seq}
  ALTER COLUMN date_written TYPE timestamp with time zone USING to_timestamp(date_written/1000) AT time zone 'UTC';`};

const transferQs = async () => {
  const client = await pool.connect();
  try {
    await client.query(queryQCreate);
    await client.query(queryQCopy);
    console.log('successfully transferred questions data');
    await client.query(queryQDate('questions'));
    const maxId = await client.query(queryMax('questions'));
    await client.query(queryQInc('questions_id_seq', maxId.rows[0].max));
    console.log('successfully altered questions table');
  } catch (err) {
    console.error('error transferring data', err);
  } finally {
    client.end();
  }
}

const transferAs = async () => {
  const client = await pool.connect();
  try {
    await client.query(queryACreate);
    await client.query(queryACopy);
    console.log('successfully transferred answers data');
    const maxId = await client.query(queryMax('answers'));
    await client.query(queryQDate('answers'));
    await client.query(queryQInc('answers_id_seq', maxId.rows[0].max));
    console.log('successfully altered answers table');
  } catch (err) {
    console.error('error transferring data', err);
  } finally {
    client.end();
  }
}

const transferAPs = async () => {
  const client = await pool.connect();
  try {
    await client.query(queryAPCreate);
    await client.query(queryAPCopy);
    console.log('successfully transferred answers photos data');
    const maxId = await client.query(queryMax('answers_photos'));
    await client.query(queryQInc('answers_photos_id_seq', maxId.rows[0].max));
    console.log('successfully altered answers_photos table');
  } catch (err) {
    console.error('error transferring data', err);
  } finally {
    client.end();
  }
}

transferQs();
transferAs();
transferAPs();

const dropTables = async () => {
  const client = await pool.connect();
  await client.query(`DROP TABLE questions;`);
  // await client.query(`DROP TABLE answers;`);
  // await client.query(`DROP TABLE answers_photos;`);
  await client.end();
  console.log('successfully dropped tables');
}

// dropTables();
