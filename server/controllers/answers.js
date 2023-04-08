const models = require('../models');

module.exports = {
  get: (req, res) => {
    models.answers.getAll()
      .then(data => res.status(200).send(data))
      .catch(err => res.status(500).send(err));
  },
  // post: (req, res) => {
  //   models.answers.create(req.body)
  //     .then(() => res.sendStatus(201))
  //     .catch(err => res.status(500).send(err));
  // }
}

