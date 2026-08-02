import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home')
        .then(m => m.Home),
    title: 'Home'
  },

  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/search')
        .then(m => m.Search),
    title: 'Search'
  },

  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/categories')
        .then(m => m.Categories),
    title: 'Categories'
  },

  {
    path: 'authors',
    loadComponent: () =>
      import('./features/authors/authors')
        .then(m => m.Authors),
    title: 'Authors'
  },

//   {
//     path: 'books/:id',
//     loadComponent: () =>
//       import('./features/books/books')
//         .then(m => m.Books),
//     title: 'Book Details'
//   },


 {
    path: 'book/:id',
    loadComponent: () =>
      import('./features/book-details/book-details')
        .then(m => m.BookDetails),
    title: 'Book Details'
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites')
        .then(m => m.Favorites),
    title: 'Favorites'
  },

  {
    path: 'library',
    loadComponent: () =>
      import('./features/my-library/my-library')
        .then(m => m.MyLibrary),
    title: 'My Library'
  },

  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile')
        .then(m => m.Profile),
    title: 'Profile'
  },

  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings')
        .then(m => m.Settings),
    title: 'Settings'
  },

  {
    path: 'history',
    loadComponent: () =>
      import('./features/reading-history/reading-history')
        .then(m => m.ReadingHistory),
    title: 'Reading History'
  },

  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about')
        .then(m => m.About),
    title: 'About'
  },

  {
    path: '**',
    redirectTo: ''
  }
];