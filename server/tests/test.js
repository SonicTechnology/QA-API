// test.js
const { mock, spec } = require('pactum');

it('should get a response with status code 200', async () => {
  // mock.addInteraction({
  //   request: {
  //     method: 'GET',
  //     path: '/qa/questions/40348'
  //   },
  //   response: {
  //     status: 200,
  //   }
  // })
  // // await mock.start(3000);
  // await mock.start(3011);

  // await mock.stop();
  await spec()
    .get('http://localhost:3000/qa/questions/40348')
    .expectStatus(200)
    .expectBody([
      {
        "id": 141984,
        "product_id": 40348,
        "body": "Eum asperiores eum est.",
        "date_written": "1588983813318",
        "asker_name": "Arvid_Reinger71",
        "asker_email": "Felton_Conroy@hotmail.com",
        "reported": false,
        "helpful": 8,
        "answers": [
          {
            "id": 277247,
            "question_id": 141984,
            "body": "Quos molestiae culpa recusandae excepturi possimus.",
            "date_written": "1588397936349",
            "answerer_name": "Hailie_Beer23",
            "answerer_email": "Lea.Hodkiewicz89@hotmail.com",
            "reported": false,
            "helpful": 19,
            "photos": []
          },
          {
            "id": 277248,
            "question_id": 141984,
            "body": "Odit repellendus consequatur et quia et veniam aspernatur.",
            "date_written": "1619330929321",
            "answerer_name": "Aiden63",
            "answerer_email": "Keshawn65@yahoo.com",
            "reported": false,
            "helpful": 18,
            "photos": [
              {
                "id": 83211,
                "answer_id": 277248,
                "url": "https://images.unsplash.com/photo-1554260570-9140fd3b7614?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
              }
            ]
          }
        ]
      },
      {
        "id": 141985,
        "product_id": 40348,
        "body": "Aut culpa rem aliquam doloribus illum.",
        "date_written": "1616026185322",
        "asker_name": "Alana_Mertz71",
        "asker_email": "Marshall43@yahoo.com",
        "reported": false,
        "helpful": 11,
        "answers": [
          {
            "id": 277249,
            "question_id": 141985,
            "body": "Delectus qui repellat est doloremque culpa est impedit eius.",
            "date_written": "1611326536949",
            "answerer_name": "Philip60",
            "answerer_email": "Arnulfo.Leannon13@gmail.com",
            "reported": false,
            "helpful": 15,
            "photos": []
          }
        ]
      },
      {
        "id": 141986,
        "product_id": 40348,
        "body": "Et quae maiores.",
        "date_written": "1602430886067",
        "asker_name": "Juston_Greenfelder",
        "asker_email": "Johann_Christiansen@gmail.com",
        "reported": false,
        "helpful": 2,
        "answers": [
          {
            "id": 277250,
            "question_id": 141986,
            "body": "Itaque ut quam rerum temporibus excepturi qui quo.",
            "date_written": "1593737807052",
            "answerer_name": "Angelita_Fadel",
            "answerer_email": "Judah_Kuvalis6@hotmail.com",
            "reported": false,
            "helpful": 19,
            "photos": [
              {
                "id": 83212,
                "answer_id": 277250,
                "url": "https://images.unsplash.com/photo-1517278322228-3fe7a86cf6f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80"
              }
            ]
          },
          {
            "id": 277251,
            "question_id": 141986,
            "body": "Suscipit modi delectus vel nobis placeat.",
            "date_written": "1589719325952",
            "answerer_name": "Jada81",
            "answerer_email": "Marisa.Marvin@gmail.com",
            "reported": false,
            "helpful": 14,
            "photos": []
          }
        ]
      }
    ])
});

// done();
  // mock.stop();