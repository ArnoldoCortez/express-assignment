// Modules
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

// Path to books.json
const p = path.join(path.dirname(require.main.filename), 'data', 'books.json');

// Book class
module.exports = class Book {
  constructor(data) {
    this.guid = uuid.v4();
    this.title = data.title;
    this.author = data.author;
    this.year = data.year;
    this.tags = data.tags;
  }

  getGuid() {
    return this.guid;
  }

  save() {
    fs.readFile(p, (err, data) => {
      let books = [];
      if (!err) {
        books = JSON.parse(data);
      }
      
      books.push(this);
      fs.writeFile(p, JSON.stringify(books), (err) => console.log(err)); 
    });
  }

  static update(books) {
    fs.writeFile(p, JSON.stringify(books), (err) => console.log(err));
  }

  static getAll(cb) {
    fs.readFile(p, (err, data) => {
      let books = [];
      if (!err) {
        books = JSON.parse(data);
      }
      
      cb(books);
    });
  }
}