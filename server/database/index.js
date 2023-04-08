const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
// const parse = require('csv-parser');
// const { parse } = require('csv-parse');
const pool = new Pool({
  database: 'test',
  port: 5432,
});

// console.log('test')

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
  date_written text not null,
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
  date_written varchar(50) not null,
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

const transferQs = async () => {
  const client = await pool.connect();
  try {
    await client.query(queryQCreate);
    await client.query(queryQCopy);
    console.log('successfully transferred questions data');
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
  } catch (err) {
    console.error('error transferring data', err);
  } finally {
    client.end();
  }
}

transferQs();
transferAs();
transferAPs();

// Promise.all([transferQs, transferAs, transferAPs]).then(() => console.log('successfully transferred all data'))



// const createTables = async () => {
//   const client = await pool.connect();
//   try {
//     await client.query(queryQCreate);
//     await client.query(queryACreate);
//     await client.query(queryAPCreate);
//     console.log('successfully created tables');
//   } catch (err) {
//     console.error('error creating tables', err);
//   } finally {
//     client.end();
//   }
// }

// // const client = pool.connect();

// const transferData = async () => {
//   const client = await pool.connect();
//   try {
//     // await client.query(queryQCreate);
//     // await client.query(queryACreate);
//     // await client.query(queryAPCreate);
//     await client.query(queryQCopy);
//     await client.query(queryACopy);
//     await client.query(queryAPCopy);
//     console.log('successfully transferred data');
//   } catch (err) {
//     console.error('error transferring data', err);
//   } finally {
//     client.end();
//   }
// }

// createTables();
// transferData();
