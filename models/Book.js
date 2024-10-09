const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewText: String,
  rating: Number,
  date: { type: Date, default: Date.now }
});

const bookSchema = new mongoose.Schema({
  ISBN: String,
  Title: String,
  Author: String, 
  Description: String,
  reviews: [reviewSchema] 
});

module.exports = mongoose.model('Book', bookSchema);
