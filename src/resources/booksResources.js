// Modules
const express = require('express');
const BooksResources = express.Router();
const { body, query } = require('express-validator');

// Controllers
const { BooksControllers } = require('../controllers');

// Validators
const validators = [
  body(['title','author','year','tags']).notEmpty(),
  body(['title','author']).isString(),
  body('year').isInt({min:1455, max:2021}).toInt(),
  body('tags').isArray(), 
];

// Book Resources
BooksResources.get('/', BooksControllers.getBooks);
BooksResources.post('/', validators, BooksControllers.createBook);
BooksResources.get('/:guid', BooksControllers.getById);
BooksResources.put('/:guid', validators, BooksControllers.updateBook);
BooksResources.delete('/:guid', BooksControllers.deleteBook);

module.exports = BooksResources;