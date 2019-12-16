const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipie',
    required: true
  },
  dateOfAttempt: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  }
}, {
  id: false,
  toJSON: { virtuals: true }
});

schema.virtual('day')
  .get(function(){
    return this.dateOfAttempt.getDate();
  })
  .set(function(day){
    return this.dateOfAttempt.setDate(day);
  });

schema.virtual('month')
  .get(function(){
    return this.dateOfAttempt.getMonth();
  })
  .set(function(month){
    return this.dateOfAttempt.setMonth(month);
  });

schema.virtual('year')  
  .get(function(){
    return this.dateOfAttempt.getFullYear();
  })
  .set(function(year){
    return this.dateOfAttempt.setFullYear(year);
  });

module.exports = mongoose.model('Attempt', schema);
