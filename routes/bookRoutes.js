const express = require('express');
const Book = require('../models/Book');
const router = express.Router();
const jwt = require('jsonwebtoken');  
require('dotenv').config();  
const mongoose = require('mongoose'); // Add this line if it's not already present 
const jwtSecret = process.env.JWT_SECRET;  

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

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
      return res.status(403).send({ error: 'No token provided' });
    }

    const bearerToken = token.split(' ')[1]; // Extract token after 'Bearer'

    jwt.verify(bearerToken, jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ error: 'Unauthorized' });
      }
      req.userId = decoded.id;
      next();
    });
};


// PUT route to add/modify a book review
router.put('/:isbn/reviews', verifyToken, async (req, res) => {
    try {
      const { isbn } = req.params;
      const { reviewText, rating } = req.body;
      const userId = req.userId; // Obtained from the JWT token
  
      // Find the book by ISBN
      const book = await Book.findOne({ ISBN: isbn });
  
      if (!book) {
        return res.status(404).send({ error: 'Book not found' });
      }
  
      // Check if the review already exists for this user
      const reviewIndex = book.reviews.findIndex(review => review.userId === userId);
  
      if (reviewIndex !== -1) {
        // If the review exists, update it
        book.reviews[reviewIndex].reviewText = reviewText;
        book.reviews[reviewIndex].rating = rating;
        await book.save();
        return res.send({ message: `The review for the book with ISBN ${isbn} has been updated.` });
      } else {
        // If the review doesn't exist, add a new one
        book.reviews.push({ userId, reviewText, rating });
        await book.save();
        return res.send({ message: `The review for the book with ISBN ${isbn} has been added.` });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Internal server error' });
    }
}); 


router.delete('/:isbn/reviews', verifyToken, async (req, res) => {
    try {
        const { isbn } = req.params;
        const userId = req.userId; // Obtained from the JWT token
        console.log('User ID from token:', userId); // Log userId

        // Find the book by ISBN
        const book = await Book.findOne({ ISBN: isbn });

        if (!book) {
            return res.status(404).send({ error: 'Book not found' });
        }

        // Log the reviews to see their user IDs
        console.log('Reviews:', book.reviews);

        // Convert userId from string to ObjectId for comparison
        const userObjectId = new mongoose.Types.ObjectId(userId); // Use 'new' keyword here

        // Find the review index by userId
        const reviewIndex = book.reviews.findIndex(review => {
            console.log('Comparing', review.userId.toString(), 'with', userObjectId.toString());
            return review.userId.equals(userObjectId); // Use equals() for ObjectId comparison
        });

        if (reviewIndex === -1) {
            return res.status(404).send({ error: 'Review not found for this user' });
        }

        // Remove the review from the array
        book.reviews.splice(reviewIndex, 1);
        await book.save();

        return res.send({ message: `The review for the book with ISBN ${isbn} has been deleted.` });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal server error' });
    }
});

  
  
module.exports = router;
