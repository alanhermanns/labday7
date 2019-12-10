const express = require('express');
const app = express();
const attemptRouter = require('./routes/attempts');
const recipeRouter = require('./routes/recipies');

app.use(express.json());
app.use(recipeRouter);
app.use(attemptRouter);

module.exports = app;
