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
  ingredients: [ingredientsSchema],
  directions: [String]
}, {
  id: false,
  toJSON: { virtuals: true }
});

schema.virtual('Attempts', {
  ref: 'Attempt',
  localField: '_id',
  foreignField: 'recipeId',
});

module.exports = mongoose.model('Recipe', schema);
