const path = require('path');
const express = require('express');
const router = require('./routes.js');

const app = express();
app.use(express.json());
// app.use(express.static());

module.exports.app = app;

// app.set('port', 3000);

app.use('/qa', router);
// app.get('/qa', router);

app.listen(3456);
console.log('Listening on port 3456');
