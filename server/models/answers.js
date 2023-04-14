const db = require('../database/db.js');

module.exports = {
  getAll: async ({ question_id }) => {
    return await db.any(
      `SELECT
        answers.*,
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

