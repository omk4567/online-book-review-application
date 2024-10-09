const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books.' });
  }
}); 

router.get('/isbn/:isbn', async (req, res) => {
    try {
      const book = await Book.findOne({ ISBN: req.params.isbn });
      if (!book) return res.status(404).json({ error: 'Book not found' });
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching book.' });
    }
}); 

// Get books by Author
router.get('/author/:author', async (req, res) => {
    try {
      const books = await Book.find({ Author: req.params.author });
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching books.' });
    }
}); 

// Get books by Title
router.get('/title/:title', async (req, res) => {
    try {
      const books = await Book.find({ Title: req.params.title });
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching books.' });
    }
}); 

// Get reviews for a book by ISBN
router.get('/:isbn/reviews', async (req, res) => {
    try {
      const book = await Book.findOne({ ISBN: req.params.isbn }).populate('reviews');
      if (!book) return res.status(404).json({ error: 'Book not found' });
      res.json(book.reviews);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching reviews.' });
    }
});  

module.exports = router;
