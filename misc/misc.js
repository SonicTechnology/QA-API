/*

const transferQs = async () => {
  try {
    await pool.none(queryCreate);
    await pool.none(queryCopy);
    console.log('successfully transferred data');
  } catch (err) {
    console.error('error transferring data', err);
  } finally {
    pool.end();
  }
}
transferQs();

pool.query(queryCopy);

const createTempTableQuery = `create table tmp_data (
  id integer,
  product_id integer not null,
  body text not null,
  date_written text not null,
  asker_name varchar(30) not null,
  asker_email varchar(50) not null,
  reported boolean not null default 'false',
  helpful integer not null default '0'
);`
// const queryCopy = `copy questions from '${csvFile} delimiter ',' form_line '2';`

const copyQuery = `
  COPY tmp_data FROM STDIN WITH (FORMAT csv, HEADER true);
`;

const insertQuery = `
  INSERT INTO questions (id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
  SELECT id, product_id, body, date_written, asker_name, asker_email, reported, helpful
  FROM tmp_data
  WHERE id is not null and product_id is not null and body is not null and date_written is not null and asker_name is not null and asker_email is not null and reported is not null and helpful is not null;
`;


const runParser = async () => {
  const stream = fs.createReadStream(csvFile);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(createTempTableQuery);
    const copyStream = client.query(copyQuery);
    stream.pipe(copyStream);
    await new Promise((resolve, reject) => {
      copyStream.on('error', reject);
      copyStream.on('end', resolve);
    });
    await client.query(insertQuery);
    await client.query('COMMIT');
    console.log('Data loaded successfully');
  } catch (err) {
    console.error(err);
    await client.query('ROLLBACK');
  } finally {
    client.release();
    pool.end();
  }
}

runParser();

fs.createReadStream('/Users/andrewihn/Documents/Hack Reactor/Senior Phase/SDC/QuestionsAPI/RawData/questions.csv')
  .pipe(parse({ delimiter: ',', from_line: 2 }))
  .on('data', (data) => {
    result.push(data)
    result.forEach(row => {
      const query = {
        text: 'insert into questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful) values($1, $2, $3, $4, $5, $6, $7, $8)',
        values: [row.id, row.product_id, row.body, row.date_written, row.asker_name, row.asker_email, row.reported, row.helpful],
      }
      pool.query('create table questions');
      pool.query(query, (err, res) => {
        if (err) throw err;
      })
    });
  })
  .on('end', () => {
    console.log(result);

  });





const getData = async () => {
  const queryCreate = `create table questions (
    id integer,
    product_id integer not null,
    body text not null,
    date_written text not null,
    asker_name varchar(30) not null,
    asker_email varchar(50) not null,
    reported boolean not null default 'false',
    helpful integer not null default '0'
  );`
  const queryCopy = `copy questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful) from '${csvFile} delimeter ',' csv header;`
  try {
    await pool.query(queryCreate);
    await pool.query(queryCopy);
    console.log('table created and data transferred')
  } catch (err) {
    console.error('error creating and transferring data', err);
  }
}

getData();

  const transferCharacteristics = async () => {
    const characteristicsPath = path.resolve(__dirname, './data/characteristics.csv');
    console.log('file name: ', characteristicsPath);
    const queryString = `COPY reviews(id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness) FROM '${characteristicsPath}' DELIMITER ',' CSV HEADER;`
    try {
      await db.none(queryString);
      console.log('transfer characteristics data complete')
    } catch (err) {
      console.log('error transfering reviews data: ', err);
    }
  }



let transformedData;
fs.readFile('../RawData/questions.csv', (err, fileData) => {
  parse(fileData, { columns: true }, (err, rows) => {
    if (err) throw err;

    rows.forEach(row => {
      const query = {
        text: 'insert into questions(id, product_id, question_body, asker_name, question_helpfulness, reported, answers) values($1, $2, $3, $4, $5, $6, $7)',
        values: [row.id, row.product_id, row.question_body, row.asker_name, row.question_helpfulness, row.reported, row.answers],
      }
      pool.query(query, (err, res) => {
        if (err) throw err;
      })
    });
  pool.end();
    // transformedData = rows.filter(row => Object.values(row).every(value => value !== null));
  })
})



console.log(transformedData);
transformedData.forEach(row => {
  const query = {
    text: 'insert into questions(id, product_id, question_body, asker_name, question_helpfulness, reported, answers) values($1, $2, $3, $4, $5, $6, $7)',
    values: [row.id, row.product_id, row.question_body, row.asker_name, row.question_helpfulness, row.reported, row.answers],
  }
  pool.query(query, (err, res) => {
    if (err) throw err;
  });
});

pool.end();

export default dbPool;

import db from './db.js';

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

models.getAs = async function(question_id, product_id) {
  return await dbPool`
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

SELECT
styles.productid,
jsonb_agg(
  json_build_object(
    'style_id', styles.id,
    'name', styles.name,
    'original price', styles.original_price,
    'sale_price', styles.sale_price,
    'default_style', styles.default_style,
    'photos', (SELECT jsonb_agg(
                json_build_object(
                  'url', photos.url,
                  'thumbnail', photos.thumbnail_url
                )
              ) AS photos
              FROM photos
              WHERE photos.styleid = styles.id)
  )
) AS results
FROM styles
INNER JOIN photos
ON styles.id = photos.styleid
AND styles.productid = ${productId}
GROUP BY styles.productid;


(SELECT json_agg(json_build_object('id', photos.id, 'url', photos.url)) FROM photos WHERE photos.review_id = reviews.review_id)

*/
/*
`select jsonb_agg(jsonb_build_object("id": questions.id, "product_id": questions.product_id, "body": questions.body, "date_written": questions.date_written, "asker_name": questions.asker_name, "asker_email": questions.asker_email, "reported": questions.reported, "helpful": questions.helpful)) from questions where product_id = ${prodId}`

*/
/*
      // return db.query(
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
    qData: question[]
    const qData = await db.many(`SELECT * FROM questions WHERE product_id = ${product_id}`);

    // aData: answers[]
    const aData = (await Promise.all(qData.map(async (q) => {
      return await db.any(`SELECT * FROM answers WHERE answers.question_id = ${q.id}`);
    }))).flat();
    // qData.forEach(async (q) => {
    //   q.answers = await db.query(`SELECT * FROM answers WHERE answers.question_id = ${q.id}`);
    //   q.answers.forEach(async (a) => {
    //     a.photos = await db.query(`SELECT answers_photos.url FROM answers_photos WHERE answers_photos.answer_id = ${a.id}`)
    //   })
    // }).flat();

    // console.log({aData})

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

GET http://44.202.235.68:3001/products/id?=%{*:1-1000000} loaderio expression syntax



*/