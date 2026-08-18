// import { CommonModule } from '@angular/common';
// import { Component, inject, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';

// import { CartService } from '../../services/cart';
// import { ContentfulService } from '../../core/services/contentful.service';

// interface SchoolBook {
//   id: string;
//   title: string;
//   author: string;
//   price: number;
//   image: string;
//   className: string;
//   subject: string;
//   language: string;
//   description?: string;
//   officialUrl?: string;
//   academicYear?: string;
// }

// @Component({
//   selector: 'app-book',
//   standalone: true,

//   imports: [
//     CommonModule
//   ],

//   templateUrl: './book.html',
//   styleUrl: './book.scss'
// })


// interface SchoolBook {
//   id: string;
//   title: string;
//   author: string;
//   price: number;
//   image: string;
//   className: string;
//   subject: string;
//   language: string;
//   description?: string;
//   officialUrl?: string;
//   academicYear?: string;
// }

// @Component({
//   selector: 'app-book',
//   standalone: true,
//   templateUrl: './book.html',
//   styleUrl: './book.scss'
// })
// export class Book implements OnInit {

//   private router = inject(Router);

//   book: SchoolBook | null = null;

//   ngOnInit(): void {

//     const navigation =
//       this.router.getCurrentNavigation();

//     this.book =
//       navigation?.extras.state?.['book'] || null;

//     console.log('Selected book:', this.book);
//   }

// }

// // export class Book implements OnInit {

// //   private route = inject(ActivatedRoute);
// //   private router = inject(Router);
// //   private contentfulService = inject(ContentfulService);

// //   cart = inject(CartService);

// //   book: SchoolBook | null = null;

// //   loading = true;

// //   error = '';


// //   async ngOnInit(): Promise<void> {

// //     const id =
// //       this.route.snapshot.paramMap.get('id');

// //     if (!id) {

// //       this.error = 'Book ID is missing.';

// //       this.loading = false;

// //       return;
// //     }

// //     await this.loadBook(id);
// //   }


// //   async loadBook(id: string): Promise<void> {

// //     try {

// //       const entries =
// //         await this.contentfulService.getNcertBooks();

// //       const entry =
// //         entries.find(
// //           item => item.sys.id === id
// //         );

// //       if (!entry) {

// //         this.error = 'Book not found.';

// //         return;
// //       }


// //       this.book = {

// //         id: entry.sys.id,

// //         title: this.getText(
// //           entry.fields.booktitle
// //         ),

// //         author: 'NCERT',

// //         price: Number(
// //           entry.fields.price
// //         ),

// //         image: this.getCoverImage(
// //           entry.fields.coverimage
// //         ),

// //         className: this.getText(
// //           entry.fields.class
// //         ),

// //         subject: this.getText(
// //           entry.fields.subject
// //         ),

// //         language: this.getText(
// //           entry.fields.lang
// //         ),

// //         description:
// //           this.getOptionalText(
// //             entry.fields.description
// //           ),

// //         officialUrl:
// //           this.getOptionalText(
// //             entry.fields.ncerturl
// //           ),

// //         academicYear:
// //           this.getOptionalText(
// //             entry.fields.academicyear
// //           )

// //       };

// //     } catch (error) {

// //       console.error(
// //         'Failed to load book:',
// //         error
// //       );

// //       this.error =
// //         'Unable to load book details.';

// //     } finally {

// //       this.loading = false;

// //     }
// //   }


// //   addToCart(): void {

// //     if (!this.book) {
// //       return;
// //     }

// //     this.cart.addToCart({

// //       id: this.book.id,

// //       title: this.book.title,

// //       author: this.book.author,

// //       price: this.book.price,

// //       image: this.book.image

// //     });

// //   }


// //   goBack(): void {

// //     this.router.navigate(['/school-books']);

// //   }


// //   private getText(value: unknown): string {

// //     if (typeof value === 'string') {
// //       return value;
// //     }

// //     if (value && typeof value === 'object') {

// //       const values =
// //         Object.values(value);

// //       const firstString =
// //         values.find(
// //           item => typeof item === 'string'
// //         );

// //       return firstString ?? '';

// //     }

// //     return '';

// //   }


// //   private getOptionalText(
// //     value: unknown
// //   ): string | undefined {

// //     const result =
// //       this.getText(value);

// //     return result || undefined;

// //   }


// //   private getCoverImage(
// //     coverimage: unknown
// //   ): string {

// //     if (
// //       !coverimage ||
// //       typeof coverimage !== 'object'
// //     ) {
// //       return 'assets/books/default.jpg';
// //     }

// //     const asset = coverimage as {
// //       fields?: {
// //         file?: {
// //           url?: string;
// //         };
// //       };
// //     };

// //     const url =
// //       asset.fields?.file?.ur

// import { CommonModule } from '@angular/common';
// import { Component, inject, OnInit } from '@angular/core';
// import { Router } from '@angular/router';

// import { CartService } from '../../services/cart';

// interface SchoolBook {
//   id: string;
//   title: string;
//   author: string;
//   price: number;
//   image: string;
//   className: string;
//   subject: string;
//   language: string;
//   description?: string;
//   officialUrl?: string;
//   academicYear?: string;
// }

// @Component({
//   selector: 'app-book',
//   standalone: true,

//   imports: [
//     CommonModule
//   ],

//   templateUrl: './book.html',
//   styleUrl: './book.scss'
// })
// export class Book implements OnInit {

//   private router = inject(Router);

//   public cart = inject(CartService);

//   book: SchoolBook | null = null;

//   loading = true;

//   error = '';


//   ngOnInit(): void {

//     const navigation =
//       this.router.getCurrentNavigation();

//     this.book =
//       navigation?.extras.state?.['book'] || null;

//     console.log(
//       'Selected book:',
//       this.book
//     );

//     if (!this.book) {

//       this.error =
//         'Book information was not found.';

//     }

//     this.loading = false;
//   }


//   addToCart(): void {

//     if (!this.book) {
//       return;
//     }

//     this.cart.addToCart({

//       id: this.book.id,

//       title: this.book.title,

//       author: this.book.author,

//       price: this.book.price,

//       image: this.book.image

//     });

//   }


//   goBack(): void {

//     this.router.navigate([
//       '/school-books'
//     ]);

//   }

// }

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CartService } from '../../services/cart';

interface SchoolBook {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  className: string;
  subject: string;
  language: string;
  description?: string;
  officialUrl?: string;
  academicYear?: string;
}

@Component({
  selector: 'app-book',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './book.html',
  styleUrl: './book.scss'
})
export class Book implements OnInit {

  private router = inject(Router);

  public cart = inject(CartService);

  book: SchoolBook | null = null;

  loading = true;

  error = '';


  ngOnInit(): void {

    const navigation =
      this.router.getCurrentNavigation();

    this.book =
      navigation?.extras.state?.['book']
      || history.state?.['book']
      || null;

    console.log(
      'Selected book:',
      this.book
    );

    if (!this.book) {

      this.error =
        'Book information was not found.';

    }

    this.loading = false;
  }


  addToCart(): void {

    console.log('Add to cart clicked');

    if (!this.book) {
      console.error('No book available');
      return;
    }

    console.log('Adding book to cart:', this.book);

    this.cart.addToCart({
      id: this.book.id,
      title: this.book.title,
      author: this.book.author,
      price: this.book.price,
      image: this.book.image
    });

    console.log('Book added to cart');
      this.router.navigate(['/cart']);

  }



  goBack(): void {

    this.router.navigate([
      '/school-books'
    ]);

  }

}