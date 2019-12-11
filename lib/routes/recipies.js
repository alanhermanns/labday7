const router  = require('express').Router;
const Recipe = require('../models/Recipe');
const Attempt = require('../models/Attempt');

module.exports = 
router()
  .post('/api/v1/recipes', (req, res) => {
    Recipe
      .create(req.body)
      .then(recipe => res.send(recipe));
  })
  .get('/api/v1/recipes', (req, res) => {
    Recipe
      .find()
      .select({ name: true })
      .then(recipes => res.send(recipes));
  })
  .get('/api/v1/recipes/:id', (req, res) => {
    Promise.all([
      Recipe.findById(req.params.id),
      Attempt.find({ recipeId : req.params.id })
    ])
      .then(([recipe, attempt]) => res.send({ ...recipe.toJSON(), attempt
      }));
  })
  .patch('/api/v1/recipes/:id', (req, res) => {
    Recipe
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(recipe => res.send(recipe));
  })
  .delete('/api/v1/recipes/:id', (req, res) => {
    Promise.all([
      Recipe.findByIdAndDelete(req.params.id),
      Attempt.find(),
      Attempt.deleteMany({ recipeId: req.params.id })
    ])
      .then(([recipe, attempts, attemptsDeleted]) => res.send({ ...recipe.toJSON(), attempts, deletedAttempts: attemptsDeleted.deletedCount }))
      .then(console.log('deleted'));
  });
