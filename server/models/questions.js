const db = require('../database/db.js');


module.exports = {
  getAll: async ({ product_id }) => {
    const data = {};
    // qData: question[]
    data.q = await db.many(`SELECT * FROM questions WHERE product_id = ${product_id} AND reported = false`);

    // aData: answers[]
    data.a = (await Promise.all(data.q.map(async (currQ) => {
      return await db.any(`SELECT * FROM answers WHERE answers.question_id = ${currQ.question_id} AND reported = false`);
      // console.log(data)
      // return data;
    }))).flat();

    // apData: photos
    data.ap = (await Promise.all(data.a.map(async (currA) => {
      return await db.any(`SELECT * FROM answers_photos WHERE answers_photos.answer_id = ${currA.id}`);
    }))).flat();

    // link aPData to aData
    data.a.forEach(async (a) => {
      a.photos = await data.ap.find(({ answer_id }) => answer_id === a.id)
    });

    // link aData to qData
    data.q.forEach(async (currQ) => {
    currQ.answers = await data.a.find((currA) => currA.question_id === currQ.question_id);
    });


    // transform object into nested object where {question_id: object}
    const result = {
      product_id,
      // results: data.q.map(q => ({[q.id]: q})),
      results: data.q,
    };

    return result;
  },

  createQ: async ({ product_id }, { body, name, email }) => {
    const createQQuery = `INSERT INTO questions(id, product_id, body, date_written, asker_name, asker_email) VALUES(DEFAULT, $1, $2, $3, $4, $5);`;
    const createQValues = [product_id, body, new Date(), name, email];
    await db.none(createQQuery, createQValues);

    return;
  }
}



