// import { Routes } from '@angular/router';
// import { SignupComponent } from './pages/signup/signup';

// export const routes: Routes = [
//   {
//     path: '',
//     loadComponent: () =>
//       import('./features/home/home')
//         .then(m => m.Home),
//     title: 'Home'
//   },

//   {
//     path: 'search',
//     loadComponent: () =>
//       import('./features/search/search')
//         .then(m => m.Search),
//     title: 'Search'
//   },

//   {
//     path: 'categories',
//     loadComponent: () =>
//       import('./features/categories/categories')
//         .then(m => m.Categories),
//     title: 'Categories'
//   },

//   {
//     path: 'authors',
//     loadComponent: () =>
//       import('./features/authors/authors')
//         .then(m => m.Authors),
//     title: 'Authors'
//   },

// //   {
// //     path: 'books/:id',
// //     loadComponent: () =>
// //       import('./features/books/books')
// //         .then(m => m.Books),
// //     title: 'Book Details'
// //   },


//  {
//     path: 'book/:id',
//     loadComponent: () =>
//       import('./features/book-details/book-details')
//         .then(m => m.BookDetails),
//     title: 'Book Details'
//   },
//   {
//     path: 'favorites',
//     loadComponent: () =>
//       import('./features/favorites/favorites')
//         .then(m => m.Favorites),
//     title: 'Favorites'
//   },

//   {
//     path: 'library',
//     loadComponent: () =>
//       import('./features/my-library/my-library')
//         .then(m => m.MyLibrary),
//     title: 'My Library'
//   },

//   {
//     path: 'profile',
//     loadComponent: () =>
//       import('./features/profile/profile')
//         .then(m => m.Profile),
//     title: 'Profile'
//   },

//   {
//     path: 'settings',
//     loadComponent: () =>
//       import('./features/settings/settings')
//         .then(m => m.Settings),
//     title: 'Settings'
//   },

//   {
//     path: 'history',
//     loadComponent: () =>
//       import('./features/reading-history/reading-history')
//         .then(m => m.ReadingHistory),
//     title: 'Reading History'
//   },

//   {
//     path: 'about',
//     loadComponent: () =>
//       import('./features/about/about')
//         .then(m => m.About),
//     title: 'About'
//   },
//   {
//     path: 'signup',
//     component: SignupComponent
//   },





  
//   {
//     path: '**',
//     redirectTo: ''
//   }
// ];


import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { OrderSuccess } from './pages/order-success/order-success';
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

  {
    path: 'book/:id',
    loadComponent: () =>
      import('./features/book-details/book-details')
        .then(m => m.BookDetails),
    title: 'Book Details'
  },
  {
  path: 'book',
  loadComponent: () =>
    import('./features/book/book')
      .then(m => m.Book),
  title: 'Books'
},
  // AUTH
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup')
        .then(m => m.SignupComponent),
    title: 'Sign Up'
  },

{
  path: 'signin',
  loadComponent: () =>
    import('./pages/signin/signin')
      .then(m => m.SigninComponent),
  title: 'Sign In'
},

  // PROTECTED
  {
    path: 'favorites',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/favorites/favorites')
        .then(m => m.Favorites),
    title: 'Favorites'
  },

  {
    path: 'library',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/my-library/my-library')
        .then(m => m.MyLibrary),
    title: 'My Library'
  },

  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/profile')
        .then(m => m.Profile),
    title: 'Profile'
  },

  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/settings/settings')
        .then(m => m.Settings),
    title: 'Settings'
  },

  {
    path: 'history',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/reading-history/reading-history')
        .then(m => m.ReadingHistory),
    title: 'Reading History'
  },

{
  path: 'school-books',
  loadComponent: () =>
    import('./features/school-books/school-books')
      .then(m => m.SchoolBooks),
  title: 'School Books'
},

{
  path: 'cart',
  loadComponent: () =>
    import('./cart/cart')
      .then(m => m.Cart),
  title: 'Shopping Cart'
},

{
  path: 'checkout',
  loadComponent: () =>
    import('./features/checkout/checkout')
      .then(m => m.Checkout),
  title: 'Checkout'
},

  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about')
        .then(m => m.About),
    title: 'About'
  },

  {
  path: 'payment',
  loadComponent: () =>
    import('./pages/payment/payment')
      .then(m => m.Payment),
  title: 'Payment'
},

{
  path: 'order-success',
  loadComponent: () =>
    import('./pages/order-success/order-success')
      .then(m => m.OrderSuccess),
  title: 'Order Successful'
},

  {
    path: '**',
    redirectTo: ''
  }
];