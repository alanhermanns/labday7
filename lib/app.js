const express = require('express');
const app = express();
const Recipe = require('./models/Recipe');
const recipeRouter = require('./routes/recipies');

app.use(express.json());
app.use(recipeRouter);

module.exports = app;
