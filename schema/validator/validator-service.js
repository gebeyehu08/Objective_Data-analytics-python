/*
 * Copyright 2022 Objectiv B.V.
 */

const express = require('express');
const { validate } = require('./validator.js');

var app = express();
app.use(express.json());

app.listen(8082, () => {
  console.log('Objectiv Validation Service ready on port 8082');
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
