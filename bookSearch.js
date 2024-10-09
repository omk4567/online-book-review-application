const axios = require('axios');

// Base URL for the book API
const BASE_URL = 'http://your-api-url/api/books'; // Replace with your actual API URL

// Task 10: Get all books using async/await
async function getAllBooks() {
    try {
        const response = await axios.get(BASE_URL);
        console.log('All Books:', response.data);
    } catch (error) {
        console.error('Error fetching all books:', error.message);
    }
}

// Task 11: Search by ISBN using Promises
function searchByISBN(isbn) {
    return axios.get(`${BASE_URL}/isbn/${isbn}`)
        .then(response => {
            console.log('Book Details by ISBN:', response.data);
        })
        .catch(error => {
            console.error('Error fetching book by ISBN:', error.message);
        });
}

// Task 12: Search by Author using Promises
function searchByAuthor(author) {
    return axios.get(`${BASE_URL}/author/${author}`)
        .then(response => {
            console.log('Books by Author:', response.data);
        })
        .catch(error => {
            console.error('Error fetching books by author:', error.message);
        });
}

// Task 13: Search by Title using async/await
async function searchByTitle(title) {
    try {
        const response = await axios.get(`${BASE_URL}/title/${title}`);
        console.log('Books by Title:', response.data);
    } catch (error) {
        console.error('Error fetching books by title:', error.message);
    }
}

// Example Usage
(async () => {
    console.log('Fetching all books...');
    await getAllBooks();
    
    console.log('\nSearching for a book by ISBN...');
    await searchByISBN('9780201616224'); // Replace with an actual ISBN
    
    console.log('\nSearching for books by Author...');
    await searchByAuthor('Andrew Hunt'); // Replace with an actual author name
    
    console.log('\nSearching for books by Title...');
    await searchByTitle('The Pragmatic Programmer'); // Replace with an actual title
})();
