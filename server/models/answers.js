// const { Pool } = require('pg');
// require('dotenv').config();
// const Pool = require('pg-promise')();
// const db = Pool({
//   database: 'test',
//   port: 5432,
// });
const db = require('../database/db.js');

module.exports = {
  getAll: async ({ product_id, question_id }) => {
    return await db.any(
      `SELECT
        id,
        question_id,
        body,
        date_written,
        answerer_name,
        answerer_email,
        reported,
        helpful,
        ARRAY(SELECT answers_photos.url FROM answers_photos WHERE answers_photos.answer_id = answers.id) AS photos
      FROM answers WHERE answers.question_id = ${question_id}`
    );
  },
  createA: async ({ question_id }, { body, name, email }) => {
    const createQQuery = `INSERT INTO answers(question_id, body, date_written, answerer_name, answerer_email) VALUES($1, $2, $3, $4, $5);`;
    const createQValues = [question_id, body, new Date(), name, email];
    await db.none(createQQuery, createQValues);
    return;
  }
}

