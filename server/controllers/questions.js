const models = require('../models');

module.exports = {
  get: (req, res) => {
    const params = req.params;
    models.questions.getAll(req.params)
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        console.log('controller error', err);
        res.status(500).send(err);
      });
  },
  post: (req, res) => {
    models.questions.createQ(req.params, req.body)
      .then(() => {
        res.sendStatus(201);
      })
      .catch(err => {
        console.log('controller post error: ', err);
        res.status(500).send(err);
      });
  }
}

