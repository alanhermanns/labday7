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
    console.log('req query', req.query);
    if(!req.query){
      Recipe
        .find()
        .then(recipes => res.send(recipes));
    } else {
      Recipe
        .find(req.query)
        .then(recipes => res.send(recipes));
    }
  })
  .get('/api/v1/recipes/:id', (req, res) => {
    Promise.all([
      Recipe.findById(req.params.id),
      Attempt.find({ recipeId : req.params.id })
    ])
      .then(([recipe, attempt]) => res.send({ ...recipe.toJSON(), attempt
      }));
  })
//   .get('/api/v1/recipes?ingredients=:id', (req, res) => {
//     console.log(req.query.id);
//     Recipe
//       .find(req.query)
//       .then(recipies => res.send(recipies));
//   })
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
