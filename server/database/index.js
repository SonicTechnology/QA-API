// const { Pool } = require('pg');
// const Pool = require('pg-promise')();
const db = require('./db.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// const db = Pool({
//   database: 'test',
//   port: 5432,
// });

// const Promise = require('bluebird');
// const initOptions = { promiseLib: Promise };
// const pgp = require('pg-promise')(initOptions);
// const db = pgp({
//   port: 5432,
//   database: 'test',
// });

const queryQCreate = `create table questions(
  id serial primary key,
  product_id integer not null,
  body text not null,
  date_written bigint not null,
  asker_name varchar(30) not null,
  asker_email varchar(50) not null,
  reported boolean not null default 'false',
  helpful integer not null default '0'
);`

const queryACreate = `create table answers (
  id serial primary key,
  question_id integer not null,
  body text not null,
  date_written bigint not null,
  answerer_name varchar(50) not null,
  answerer_email varchar(100) not null,
  reported boolean not null default 'false',
  helpful integer not null default '0'
);`

const queryAPCreate = `create table answers_photos (
  id serial primary key,
  answer_id integer not null,
  url text not null
)`

const csvQ = path.join(__dirname, '../../RawData/questions.csv');
const csvA = path.join(__dirname, '../../RawData/answers.csv');
const csvAP = path.join(__dirname, '../../RawData/answers_photos.csv');

const queryQCopy = `copy questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful) from '${csvQ}' with (format csv, header true);`
const queryACopy = `copy answers(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful) from '${csvA}' with (format csv, header true);`
const queryAPCopy = `copy answers_photos(id, answer_id, url) from '${csvAP}' with (format csv, header true);`

const queryPIndex = `CREATE INDEX product_id_index ON questions(product_id);`;
const queryQIndex = `CREATE INDEX question_id_index ON answers(question_id);`;
const queryAIndex = `CREATE INDEX answer_id_index ON answers_photos(answer_id);`;

const queryMax = (table) => {return `SELECT max(id) from ${table};`};
const queryQInc = (seq, max) => {return `ALTER SEQUENCE ${seq} RESTART WITH ${max};`};

// 2018-10-18T00:00:00.000Z
const queryQDate = (table) => {return `ALTER TABLE ${table}
  ALTER COLUMN date_written TYPE timestamp with time zone USING to_timestamp(date_written/1000) AT time zone 'UTC';`};

const transferQs = async () => {
  try {
    await db.none(queryQCreate);
    await db.none(queryQCopy);
    console.log('successfully transferred questions data');
    await db.none(queryQDate('questions'));
    await db.any(queryMax('questions'))
      .then(async (currMax) => {
        // console.log(currMax[0].max)
        await db.none(queryQInc('questions_id_seq', currMax[0].max));
      })
      .catch((err) => {
        console.error('Error in altering questions id seq')
      });
    console.log('successfully altered questions table');
  } catch (err) {
    console.error('error transferring data', err);
  } finally {
    console.log('successfully created Q db');
  }
}

const transferAs = async () => {
  try {
    await db.none(queryACreate);
    await db.none(queryACopy);
    console.log('successfully transferred answers data');
    await db.none(queryQIndex);
    await db.any(queryMax('answers'))
      .then(async (currMax) => {
        await db.none(queryQInc('answers_id_seq', currMax[0].max));
      })
      .catch((err) => {
        console.error('Error in altering answers id seq')
      });
    await db.none(queryQDate('answers'));
    console.log('successfully altered answers table');
  } catch (err) {
    console.error('error transferring data', err);
  } finally {
    console.log('successfully created A db')
  }
}

const transferAPs = async () => {
  try {
    await db.none(queryAPCreate);
    await db.none(queryAPCopy);
    console.log('successfully transferred answers photos data');
    await db.none(queryAIndex);
    await db.any(queryMax('answers_photos'))
      .then(async (currMax) => {
        await db.none(queryQInc('answers_photos_id_seq', currMax[0].max));
      })
      .catch((err) => {
        console.error('Error in altering answers_photos id seq')
      });
    console.log('successfully altered answers_photos table');
  } catch (err) {
    console.error('error transferring data', err);
  } finally {
    console.log('successfully created AP db');
  }
}

transferQs();
transferAs();
transferAPs();

const dropTables = async () => {
  await db.none(`DROP TABLE answers_photos;`);
  await db.none(`DROP TABLE answers;`);
  await db.none(`DROP TABLE questions;`);
  console.log('successfully dropped tables');
}

// dropTables();

// module.exports.db = db;
