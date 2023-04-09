const models = require('../models');

module.exports = {
  get: (req, res) => {
    const params = req.params;
    console.log('controller');
    models.answers.getAll(req.params)
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        console.log('controller error', err);
        res.status(500).send(err);
      });
  },
  post: (req, res) => {
    models.answers.createA(req.params, req.body)
      .then(() => {
        console.log('controller post success');
        res.sendStatus(201);
      })
      .catch(err => {
        console.log('controller post error: ', err);
        res.status(500).send(err);
      });
  }
}