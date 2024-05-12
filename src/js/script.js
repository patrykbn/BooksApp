/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';
  
  class BooksList {
    constructor(selectors) {
      this.select = selectors;
      this.favouriteBooks = [];
      this.filters = [];
    }
  
    render() {
      const books = dataSource.books;
  
      for (const book of books) {
        const { id, name, price, rating, image, details } = book;
        const ratingWidth = rating * 10;
        const ratingBgc = this.determineRatingBgc(rating);
  
        const template = document.getElementById(this.select.templateOf).innerHTML;
        const compiledTemplate = Handlebars.compile(template);
        const html = compiledTemplate({ id, name, price, rating, image, details, ratingWidth, ratingBgc });
        const bookElement = utils.createDOMFromHTML(html);
  
        document.querySelector(this.select.booksList).appendChild(bookElement);
      }
      this.initActions();
    }
  
    initActions() {
      const booksListContainer = document.querySelector(this.select.booksList);
      booksListContainer.addEventListener('dblclick', (event) => {
        const clickedImage = event.target.closest('a.book__image');
        if (clickedImage) {
          let imageId = clickedImage.dataset.id;
          const imageIndex = this.favouriteBooks.indexOf(imageId);
          if (imageIndex > -1) {
            this.favouriteBooks.splice(imageIndex, 1);
            clickedImage.classList.remove('favorite');
          } else {
            this.favouriteBooks.push(imageId);
            clickedImage.classList.add('favorite');
          }
        }
      });
  
      const filtersContainer = document.querySelector(this.select.filters);
      filtersContainer.addEventListener('click', (event) => {
        const clickedFilter = event.target;
        if (clickedFilter.name == 'filter' && clickedFilter.tagName == 'INPUT' && clickedFilter.type == 'checkbox') {
          const filterIndex = this.filters.indexOf(clickedFilter.value);
          if (filterIndex > -1) {
            this.filters.splice(filterIndex, 1);
          } else {
            this.filters.push(clickedFilter.value);
          }
        }
        console.log(this.filters);
        this.filterBooks();
      });
    }
  
    filterBooks() {
      const books = dataSource.books;
  
      for (const book of books) {
        const details = book.details;
        const bookId = book.id;
        let matchesFilters = true;
  
        for (const filter of this.filters) {
          if (!details[filter]) {
            matchesFilters = false;
            break;
          }
        }
        const bookImage = document.querySelector(`a.book__image[data-id="${bookId}"]`);
        if (bookImage) {
          if (matchesFilters) {
            bookImage.classList.remove('hidden');
          } else {
            bookImage.classList.add('hidden');
          }
        }
      }
    }
  
    determineRatingBgc(rating) {
      let ratingBgc = 'white';
      if (rating < 2.5) {
        ratingBgc = 'red';
      } else if (rating < 5.0) {
        ratingBgc = 'yellow';
      } else if (rating < 7.5) {
        ratingBgc = 'lightgreen';
      } else if (rating < 9) {
        ratingBgc = 'green';
      } else if (rating >= 9) {
        ratingBgc = 'pink';
      }
      return ratingBgc;
    }
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    const selectors = {
      templateOf: 'template-book',
      booksList: '.books-list',
      bookImage: '.book__image',
      filters: '.filters',
    };
    const app = new BooksList(selectors);
    app.render();
  });
  
}