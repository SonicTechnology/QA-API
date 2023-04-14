const path = require('path');
const express = require('express');
const router = require('./routes.js');
require('dotenv').config();

const app = express();
app.use(express.json());
// app.use(express.static());

module.exports.app = app;

// app.get(`/${process.env.LVERT}`, (req, res) => res.send(`${process.env.LVERT}`));
app.get('/loaderio-2bc8682854ddaec42a70f8b98d84f22a', (req, res) => res.send('loaderio-2bc8682854ddaec42a70f8b98d84f22a'));
app.use('/qa', router);

app.listen(3001);
console.log('Listening on port 3001');
