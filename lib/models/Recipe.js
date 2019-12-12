const mongoose = require('mongoose');

const ingredientsSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  measurement: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
  }
});



const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  directions: [String],
  ingredients: [ingredientsSchema],
  id : false,
  toJSON: { virtuals : true },
});


schema.virtuals('Attempts', {
  ref: 'Attempt',
  localField: '_id',
  foreignField: 'recipeId',
});

module.exports = mongoose.model('Recipe', schema);
