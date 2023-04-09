const { Pool } = require('pg');
// require('dotenv').config();

const pool = new Pool({
  database: 'test',
  port: 5432,
});

module.exports = {
  getAll: async ({ product_id, question_id }) => {
    const client = await pool.connect();
    const dataQ = await client.query(
      `SELECT
        id,
        question_id,
        body,
        date_written,
        answerer_name,
        answerer_email,
        reported,
        helpful,
        (SELECT coalesce(json_agg(json_build_object(
          'id', answers_photos.id,
          'answer_id', answers_photos.answer_id,
          'url', answers_photos.url
        )), '[]') FROM answers_photos WHERE answers_photos.answer_id = answers.id
      ) FROM answers WHERE answers.question_id = ${question_id}`
    );
      client.end();
    return dataQ.rows;
  },
  createA: async ({ question_id }, { body, name, email }) => {
    const client = await pool.connect();
    const data = await pool.query(`SELECT max(id) FROM answers`);
    const createQQuery = `INSERT INTO answers(id, question_id, body, date_written, answerer_name, answerer_email) VALUES($1, $2, $3, $4, $5, $6);`;
    const createQValues = [data.rows[0].max + 1, question_id, body, new Date(), name, email];
    await client.query(createQQuery, createQValues);
    return;
  }
}

