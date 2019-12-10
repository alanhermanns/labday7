const router  = require('express').Router;
const Attempt = require('../models/Attempt');

module.exports = 
router()
  .post('/api/v1/attempts', (req, res) => {
    Attempt
      .create(req.body)
      .then(attempt => res.send(attempt));
  })
  .get('/api/v1/attempts', (req, res) => {
    Attempt
      .find()
      .select({ name: true })
      .then(attempts => res.send(attempts));
  })
  .get('/api/v1/attempts/:id', (req, res) => {
    Attempt
      .findById(req.params.id)
      .then(attempt => res.send(attempt));
  })
  .patch('/api/v1/attempts/:id', (req, res) => {
    Attempt
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(attempt => res.send(attempt));
  })
  .delete('/api/v1/attempts/:id', (req, res) => {
    Attempt
      .findByIdAndDelete(req.params.id)
      .then(attempt => res.send(attempt));
  });

