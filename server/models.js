import dbPool from './db.js';

const getQs = (product_id) => {
  return dbPool.query(
    `select
      question_body,
      question_date,
      asker_name,
      question_helpfulness,
      reported,
      answers
    from questions
    where product_id = ${product_id}`
    )
  // return questions
}

// models.getAs = async function(question_id, product_id) {
//   return await dbPool`
//     select
//       id,
//       body,
//       date,
//       answerer_name,
//       helpfulness,
//       photos
//     from answers
//     where question_id = ${question_id} and product_id = ${product_id}
//   `
// }
