const db = require('./db.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

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
// const queryQIDIndex = `CREATE INDEX questions_id_index ON questions(id);`;
const queryQIndex = `CREATE INDEX question_id_index ON answers(question_id);`;
// const queryAIDIndex = `CREATE INDEX answers_id_index ON answers(id);`;
const queryAIndex = `CREATE INDEX answer_id_index ON answers_photos(answer_id);`;

const queryMax = (table, col) => {return `SELECT max(${col}) from ${table};`};
const queryInc = (seq, max) => {return `ALTER SEQUENCE ${seq} RESTART WITH ${max};`};

// 2018-10-18T00:00:00.000Z
const queryQDate = (table) => {return `ALTER TABLE ${table}
  ALTER COLUMN date_written TYPE timestamp with time zone USING to_timestamp(date_written/1000) AT time zone 'UTC';`};

// alter columns to fit api request
const queryAlter = (tab, prev, mod) => `ALTER TABLE ${tab} RENAME COLUMN ${prev} TO ${mod};`;

// const queryAlterQ = ['questions', 'id',
// `question_id,
//   RENAME COLUMN body TO question_body,
//   RENAME COLUMN date_written TO question_date,
//   RENAME COLUMN helpful TO questions_helpfulness`
// ];
// const queryAlterA = [
//   'answers',
//   'date_written',
//   'date,RENAME COLUMN helpful TO helpfulness'
// ];

// delete unnecessary columns
// const queryDelQCol = 'ALTER TABLE DROP COLUMN ';


const transferQs = async () => {
  try {
    await db.none(queryQCreate);
    await db.none(queryQCopy);
    console.log('successfully transferred questions data');
    await db.none(queryPIndex);
    await db.none(queryQDate('questions'));
    await db.none(queryAlter('questions', 'id', 'question_id'));
    await db.none(queryAlter('questions', 'body', 'question_body'));
    await db.none(queryAlter('questions', 'date_written', 'question_date'));
    await db.none(queryAlter('questions', 'helpful', 'question_helpfulness'));
    await db.any(queryMax('questions', 'question_id'))
      .then(async (currMax) => {
        // console.log(currMax[0].max)
        await db.none(queryInc('questions_id_seq', currMax[0].max));
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
    await db.any(queryMax('answers', 'id'))
      .then(async (currMax) => {
        await db.none(queryInc('answers_id_seq', currMax[0].max));
      })
      .catch((err) => {
        console.error('Error in altering answers id seq')
      });
    await db.none(queryQDate('answers'));
    await db.none(queryAlter('answers', 'date_written', 'date'));
    await db.none(queryAlter('answers', 'helpful', 'helpfulness'));
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
    await db.any(queryMax('answers_photos', 'id'))
      .then(async (currMax) => {
        await db.none(queryInc('answers_photos_id_seq', currMax[0].max));
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

const transformTables = async () => {
  await transferQs();
  await transferAs();
  await transferAPs();
  console.log('successfully transformed database');
}

transformTables();

const dropTables = async () => {
  await db.none(`DROP TABLE answers_photos;`);
  await db.none(`DROP TABLE answers;`);
  await db.none(`DROP TABLE questions;`);
  console.log('successfully dropped tables');
}

// dropTables();

