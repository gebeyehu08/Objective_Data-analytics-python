/*
 * Copyright 2022 Objectiv B.V.
 */

const express = require('express');
const { validate } = require('./validator.js');

var app = express();
app.use(express.json());
var port = 8082;
if (process.env.PORT) {
  port = process.env.PORT;
}
app.listen(port, () => {
  console.log(`Objectiv Validation Service ready on port ${port}`);
});

app.post('/', (req, res) => {
  if (!req.body) {
    res.json({
      success: false,
      error: 'Please provide the Event to validate as JSON',
    });
  } else {
    res.json(validate(req.body));
  }
});
