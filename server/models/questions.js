// const { Pool } = require('pg');
// require('dotenv').config();
// const Pool = require('pg-promise')();
// const db = Pool({
//   database: 'test',
//   port: 5432,
// });
const db = require('../database/db.js');

// returns
// {
//  "product_id": product_id,
//  results: [{
//   question_id: {
//    'question_id': q.id,
//    'question_body', q.body,
//    'question_date', q.date_written,
//    'asker_name', q.asker_name,
//    'question_helpfulness', q.helpful,
//    'reported', q.reported,
//    'answers': answer | null []
//  }
// }]
// }
module.exports = {
  getAll: async ({ product_id }) => {
    // // qData: question[]
    // const qData = await db.any(`SELECT * FROM questions WHERE product_id = ${product_id}`);

    // // aData: answers[]
    // const aData = (await Promise.all(qData.map(async (q) => {
    //   return await db.any(`SELECT * FROM answers WHERE answers.question_id = ${q.id}`);
    // }))).flat();

    // // console.log({aData})

    // aData.forEach(async (a) => {
    //   const photos = await db.any(`SELECT answers_photos.url FROM answers_photos WHERE answers_photos.answer_id = ${a.id}`)

    //   a.photos = photos;
    // })

    // // linking answers to questions
    // qData.forEach((q) => {
    //   q.answers = aData.find(({ question_id }) => question_id === q.id)
    // })

    // // transform object into nested object where {question_id: object}
    // const result = {
    //   product_id,
    //   results: qData.map(q => ({[q.id]: q}))
    // }

    // return result

  //   return await db.any(`
  //   SELECT q.product_id,
  //   jsonb_agg(
  //     jsonb_build_object(
  //       'question_id', q.id,
  //       'question_body', q.body,
  //       'question_date', q.date_written,
  //       'asker_name', q.asker_name,
  //       'question_helpfulness', q.helpful,
  //       'reported', q.reported,
  //       'answers', (
  //         SELECT coalesce(
  //           jsonb_agg(
  //             jsonb_build_object(
  //               'id', a.id,
  //               'body', a.body,
  //               'date', a.date_written,
  //               'answerer_name', a.answerer_name,
  //               'helpfulness', a.helpful,
  //               'photos', ARRAY(SELECT answers_photos.url FROM answers_photos WHERE answers_photos.answer_id = a.id)
  //             )
  //           ), '[]'
  //         )
  //         FROM answers a
  //         WHERE a.question_id = q.id
  //       )
  //     )
  //   ) AS results
  // FROM questions q
  // LEFT JOIN answers a ON q.id = a.question_id
  // LEFT JOIN answers_photos ap ON a.id = ap.answer_id
  // WHERE q.product_id = ${product_id}
  // GROUP BY q.product_id, q.id;
  // `)


      return await db.any(
        `SELECT q.product_id,
          jsonb_agg(
            jsonb_build_object(
              'question_id', q.id,
              'question_body', q.body,
              'question_date', q.date_written,
              'asker_name', q.asker_name,
              'question_helpfulness', q.helpful,
              'reported', q.reported,
              'answers', (
                SELECT coalesce(
                  jsonb_agg(
                    jsonb_build_object(
                      'id', a.id,
                      'body', a.body,
                      'date', a.date_written,
                      'answerer_name', a.answerer_name,
                      'helpfulness', a.helpful,
                      'photos', ARRAY(SELECT answers_photos.url FROM answers_photos WHERE answers_photos.answer_id = a.id)
                    )
                  ), '[]'
                )
                FROM answers a
                WHERE a.question_id = q.id
              )
            )
          ) AS results
        FROM questions q
        WHERE q.product_id = ${product_id}
        GROUP BY q.product_id;`
      )
  },
  createQ: async ({ product_id }, { body, name, email }) => {
    const createQQuery = `INSERT INTO questions(id, product_id, body, date_written, asker_name, asker_email) VALUES(DEFAULT, $1, $2, $3, $4, $5);`;
    const createQValues = [product_id, body, new Date(), name, email];
    await db.none(createQQuery, createQValues);
    // const newData = await client.query(`select * from questions where product_id = ${product_id} order by id DESC;`)
    // console.log(newData.rows);
    return;
  }
}


/*
      // return db.any(
      //   `SELECT q.product_id,
      //     jsonb_agg(
      //       jsonb_build_object(
      //         'question_id', q.id,
      //         'question_body', q.body,
      //         'question_date', q.date_written,
      //         'asker_name', q.asker_name,
      //         'question_helpfulness', q.helpful,
      //         'reported', q.reported,
      //         'answers', COALESCE(a.answers_json, '[]'::jsonb)
      //       )
      //     ) AS results
      //   FROM questions q
      //   LEFT JOIN LATERAL (
      //   SELECT jsonb_agg(
      //     jsonb_build_object(
      //       'id', a.id,
      //       'body', a.body,
      //       'date', a.date_written,
      //       'answerer_name', a.answerer_name,
      //       'helpfulness', a.helpful,
      //       'photos', COALESCE(
      //             (
      //               SELECT jsonb_agg(ap.url)
      //               FROM answers_photos ap
      //               WHERE ap.answer_id = a.id
      //             ),
      //             '[]'::jsonb
      //           )
      //         )
      //       ) AS answers_json
      //   FROM answers a
      //   WHERE a.question_id = q.id
      //   ) a ON true
      //   WHERE q.product_id = ${product_id}
      //   GROUP BY q.product_id;`
      // )
        `SELECT q.product_id,
      jsonb_agg(
        jsonb_build_object(
          'question_id', q.id,
          'question_body', q.body,
          'question_date', q.date_written,
          'asker_name', q.asker_name,
          'question_helpfulness', q.helpful,
          'reported', q.reported,
          'answers', COALESCE(a.answers_json, '[]'::jsonb)
        )
      ) AS results
FROM questions q
LEFT JOIN LATERAL (
 SELECT jsonb_agg(
          jsonb_build_object(
            'id', a.id,
            'body', a.body,
            'date', a.date_written,
            'answerer_name', a.answerer_name,
            'helpfulness', a.helpful,
            'photos', COALESCE(
              (
                SELECT jsonb_agg(ap.url)
                FROM answers_photos ap
                WHERE ap.answer_id = a.id
              ),
              '[]'::jsonb
            )
          )
        ) AS answers_json
 FROM answers a
 WHERE a.question_id = q.id
) a ON true
WHERE q.product_id = ${product_id}
GROUP BY q.product_id;
`)

*/
