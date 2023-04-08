const router = require('express').Router();
const controller = require('./controllers');


router.get('/questions/:product_id', controller.questions.get);
// router.get('/questions/:product_id/:question_id', controller.answers.get);

router.post('/questions/:product_id', controller.questions.post);
// router.post('/answers', controller.answers.post);

module.exports = router;

// module.exports = {
//   getQs: router.get('/questions', controller.questions.get),
//   getAs: router.get('/answers', controller.answers.get),
// }
