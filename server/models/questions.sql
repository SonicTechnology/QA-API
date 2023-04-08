-- SELECT questions.id, questions.product_id, questions.body, questions.date_written, questions.asker_name, questions.asker_email, questions.reported, questions.helpful, coalesce(json_agg(json_build_object('id', answers.id, 'question_id', answers.question_id, 'body', answers.body, 'date_written', answers.date_written, 'answerer_name', answers.answerer_name, 'reported', answers.reported, 'helpful', answers.helpful), '[]') WHERE answers.question_id = questions.id) AS answers FROM questions WHERE product_id = ${product_id} ORDER BY id

SELECT
  questions.id ->> 'id' as id,
  questions.product_id ->> 'product_id' as product_id,
  questions.body ->> 'body' as question_body,
  questions.date_written ->> 'date' as question_date,
  questions.asker_name ->> 'asker_name' as asker_name,
  questions.asker_email ->> 'asker_email' as asker_email,
  questions.reported ->> 'reported' as reported,
  questions.helpful ->> 'helpful' as helpful
FROM (
  select jsonb_
)
