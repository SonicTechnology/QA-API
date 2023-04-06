// import dbPool from 'dbPool.js';
// import postgres from 'postgres';
const fs = require('fs');
const parse = require('csv-parse');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  database: 'test',
  // password: '2302sdcqa',
  port: 5432,
});

// let transformedData;
fs.readFile('../../RawData/questions.csv', (err, fileData) => {
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



// console.log(transformedData);
// transformedData.forEach(row => {
//   const query = {
//     text: 'insert into questions(id, product_id, question_body, asker_name, question_helpfulness, reported, answers) values($1, $2, $3, $4, $5, $6, $7)',
//     values: [row.id, row.product_id, row.question_body, row.asker_name, row.question_helpfulness, row.reported, row.answers],
//   }
//   pool.query(query, (err, res) => {
//     if (err) throw err;
//   });
// });

// pool.end();

// export default dbPool;
