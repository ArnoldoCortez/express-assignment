const { validationResult } = require('express-validator');

// Models
const { Book } = require('../models');

// Get all books from books.json
const getBooks = (req, res) => {
  const { query } = req;
  const keys = Object.keys(query);
  let match = false;
  let matches = [];

  if (keys.length !== 0) {
    Book.getAll((books) => {
      books.forEach(book => {
        match = keys.every(key => {
          if (key === 'title' || key === 'author') {
            return book[key].toLowerCase().split(' ').join('') === query[key].toLowerCase().split(' ').join('');
          } else if (key === 'year') {
            return book[key] === Number(query[key]);
          } else if (key === 'tag') {
            return book.tags.indexOf(query[key]) !== -1
          }
        });
        if (match === true) matches.push(book);
      });
      if (matches.length !== 0) {
        return res.send(matches);
      }
      return res.send({message: 'No matches found!!!'});
    });
  } else {
    Book.getAll((books) => {
      res.send(books);
    });
  }
};

// Get book by id
const getById = (req, res) => {
  const { params:{ guid }} = req;
  
  Book.getAll((books) => {
    const book = books.find(ent => ent.guid === guid);

    if (book) {
      res.send(book);
    } else {
      res.status(404).send({
        message: 'Ups!!! Book not found',
      });
    }
  });
};

// Create a new book
const createBook = (req, res) => {

  const { body } = req;
  const errors = validationResult(req);
  let guid;
  let sameBook = false;
  let arrayOfStrings = false;

  if (!errors.isEmpty()) {
    return res.status(400).send({errors: errors.errors});
  }

  arrayOfStrings = body.tags.every(tag => typeof tag === 'string');

  if (!arrayOfStrings) {
    return res.status(400).send({
      message: 'All the tags need to be string!!!',
    });
  }

  Book.getAll((books) => {
    books.forEach(book => {
      const title = book.title.toLowerCase().split(' ').join('') === body.title.toLowerCase().split(' ').join('') ? true:false;
      const author = book.author.toLowerCase().split(' ').join('') === body.author.toLowerCase().split(' ').join('') ? true:false;

      if (title && author && book.year === body.year) {
        sameBook = true;
        guid = book.guid;
        return;
      }
    });
    
    if ( sameBook ) {
      return res.status(200).send({
        message: `Book is already in the database with guid: ${guid}`,
      });
    }
    
    const newBook = new Book(body);
    newBook.save();
  
    res.status(201).send({
      message: 'Book successfully created!!!',
      guid: newBook.getGuid(),
    });
  });
};

// Update book by id
const updateBook = (req, res) => {
  const { params:{ guid }, body} = req;
  const errors = validationResult(req);
  let arrayOfStrings = false;

  if (!errors.isEmpty()) {
    return res.status(400).send({errors: errors.errors});
  }

  arrayOfStrings = body.tags.every(tag => typeof tag === 'string');

  if (!arrayOfStrings) {
    return res.status(400).send({
      message: 'All the tags need to be string!!!',
    });
  }

  if (Object.keys(body).length > 4) {
    return res.status(400).send({message: 'There are more parameters than expected'});
  }

  Book.getAll((books) => {
    const book = books.find(ent => ent.guid === guid);

    if (book) {
      Object.assign(book, body);
      Book.update(books);
      res.send({
        message: 'Book successfully updated!!!',
      });
    } else {
      res.status(404).send({
        message: 'Ups!!! Book not found',
      });
    }
  });
};

// Delete book given an id
const deleteBook = (req, res) => {
  const { guid } = req.params;
  
  Book.getAll((books) => {
    const bookIdx = books.findIndex(ent => ent.guid === guid);

    if (bookIdx !== -1) {
      books.splice(bookIdx, 1);
      Book.update(books);
      res.send({
        message: 'Book successfully deleted!!!',
      });
    } else {
      res.status(404).send({
        message: 'Ups!!! Book not found',
      });
    }
  });
};
module.exports = {
  getBooks,
  getById,
  createBook,
  updateBook,
  deleteBook,
}