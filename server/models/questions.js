const db = require('../database/db.js');


module.exports = {
  getAll: async ({ product_id }) => {
    // qData: question[]
    const qData = await db.many(`SELECT * FROM questions WHERE product_id = ${product_id}`);

    // aData: answers[]
    const aData = (await Promise.all(qData.map(async (q) => {
      return await db.any(`SELECT * FROM answers WHERE answers.question_id = ${q.id}`);
    }))).flat();

    aData.forEach(async (a) => {
      const photos = await db.any(`SELECT answers_photos.url FROM answers_photos WHERE answers_photos.answer_id = ${a.id}`)
      a.photos = photos;
    })

    // linking answers to questions
    qData.forEach((q) => {
      q.answers = aData.find(({ question_id }) => question_id === q.id)
    })

    // transform object into nested object where {question_id: object}
    const result = {
      product_id,
      results: qData.map(q => ({[q.id]: q}))
    }

    return result
  },

  createQ: async ({ product_id }, { body, name, email }) => {
    const createQQuery = `INSERT INTO questions(id, product_id, body, date_written, asker_name, asker_email) VALUES(DEFAULT, $1, $2, $3, $4, $5);`;
    const createQValues = [product_id, body, new Date(), name, email];
    await db.none(createQQuery, createQValues);

    return;
  }
}



