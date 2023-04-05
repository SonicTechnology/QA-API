import db from './db.js';

models.getQs = async function(product_id) {
  return await db`
    select
      question_body,
      question_date,
      asker_name,
      question_helpfulness,
      reported,
      answers
    from questions
    where product_id = ${product_id}
  `
  // return questions
}

models.getAs = async function(question_id, product_id) {
  return await db`
    select
      id,
      body,
      date,
      answerer_name,
      helpfulness,
      photos
    from answers
    where question_id = ${question_id} and product_id = ${product_id}
  `
}
