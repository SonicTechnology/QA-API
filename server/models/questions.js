// const db = require('../database');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  database: process.env.PG_DB,
  port: process.env.PG_PORT,
});

module.exports = {
  getAllQs: async ({ product_id }) => {
    const client = await pool.connect();
    const dataQ = await client.query(`
      SELECT questions.id, questions.product_id, questions.body, questions.date_written, questions.asker_name, questions.asker_email, questions.reported, questions.helpful, (SELECT json_agg(json_build_object(
        'id', answers.id,
        'question_id', answers.question_id,
        'body', answers.body,
        'date_written', answers.date_written,
        'answerer_name', answers.answerer_name,
        'answerer_email', answers.answerer_email,
        'reported', answers.reported,
        'helpful', answers.helpful,
        'photos', (SELECT json_agg(json_build_object(
          'id', answers_photos.id,
          'answer_id', answers_photos.answer_id,
          'url', answers_photos.url))
          FROM answers_photos WHERE answers_photos.answer_id = answers.id)))
        FROM answers WHERE answers.question_id = questions.id)
      AS answers FROM questions WHERE product_id = ${product_id} ORDER BY id;`);
    return dataQ.rows;
  },
  // createQ: async ({ product_id }, { body, name, email }) => {
  //   const client = await pool.connect();
  //   // const data = await pool.query(`select * from questions`)
  //   const createQQuery = `INSERT INTO questions(id, product_id, body, date_written, asker_name, asker_email) VALUES(DEFAULT, $1, $2, $3, $4, $5);`;
  //   const createQValues = [product_id, body, new Date(), name, email];
  //   await client.query(createQQuery, createQValues);
  //   // const newData = await client.query(`select * from questions where product_id = ${product_id} order by id DESC;`)
  //   // console.log(newData.rows);
  //   return;
  // }
}

