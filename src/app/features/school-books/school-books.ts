// // import { Component, inject } from '@angular/core';
// // import { Router } from '@angular/router';
// // import { CartService } from '../../services/cart';

// // interface SchoolBook {
// //   id: string;
// //   title: string;
// //   author: string;
// //   price: number;
// //   image: string;
// //   className: string;
// // }

// // @Component({
// //   selector: 'app-school-books',
// //   standalone: true,
// //   templateUrl: './school-books.html',
// //   styleUrl: './school-books.scss'
// // })
// // export class SchoolBooks {

// //   private router = inject(Router);

// //   public cart = inject(CartService);

// //   books: SchoolBook[] = [
// //     {
// //       id: 'school-1',
// //       title: 'Mathematics',
// //       author: 'NCERT',
// //       price: 250,
// //       image: 'assets/books/math.jpg',
// //       className: 'Class 10'
// //     },
// //     {
// //       id: 'school-2',
// //       title: 'Science',
// //       author: 'NCERT',
// //       price: 280,
// //       image: 'assets/books/science.jpg',
// //       className: 'Class 10'
// //     },
// //     {
// //       id: 'school-3',
// //       title: 'English',
// //       author: 'NCERT',
// //       price: 220,
// //       image: 'assets/books/english.jpg',
// //       className: 'Class 9'
// //     }
// //   ];

// //   viewDetails(book: SchoolBook): void {
// //     this.router.navigate([
// //       '/book',
// //       book.id
// //     ]);
// //   }

// //   addToCart(book: SchoolBook): void {

// //     this.cart.addToCart({
// //       id: book.id,
// //       title: book.title,
// //       author: book.author,
// //       price: book.price,
// //       image: book.image
// //     });
// //   }
// // }

// import { Component, inject } from '@angular/core';
// import { Router } from '@angular/router';
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
//   officialUrl?: string;
// }

// @Component({
//   selector: 'app-school-books',
//   standalone: true,
//   templateUrl: './school-books.html',
//   styleUrl: './school-books.scss'
// })
// export class SchoolBooks {

//   private router = inject(Router);
//   private contentfulService = inject(ContentfulService);

//   public cart = inject(CartService);

//   books: SchoolBook[] = [];

//   loading = false;
//   error: string | null = null;

//   async ngOnInit(): Promise<void> {
//     await this.loadBooks();
//   }

//   async loadBooks(): Promise<void> {
//     this.loading = true;
//     this.error = null;

//     try {
//       const entries = await this.contentfulService.getNcertBooks();

//         this.books = entries.map((entry, index) => ({
//         id: entry.sys.id || `school-${index + 1}`,
//         title: entry.fields.title,
//         author: 'NCERT',
//         price: 250,
//         image: this.getCoverImage(entry.fields.coverImage),
//         className: entry.fields.className,
//         subject: entry.fields.subject,
//         language: entry.fields.language,
//         officialUrl: entry.fields.officialUrl
//       }));

//     } catch (err) {
//       console.error('Failed to load school books:', err);

//       this.error = 'Unable to load school books. Please try again.';

//       // Keep some fallback books if Contentful fails
//       this.books = [
//         {
//           id: 'school-1',
//           title: 'Mathematics',
//           author: 'NCERT',
//           price: 250,
//           image: 'assets/books/math.jpg',
//           className: 'Class 10',
//           subject: 'Mathematics',
//           language: 'English'
//         },
//         {
//           id: 'school-2',
//           title: 'Science',
//           author: 'NCERT',
//           price: 280,
//           image: 'assets/books/science.jpg',
//           className: 'Class 10',
//           subject: 'Science',
//           language: 'English'
//         },
//         {
//           id: 'school-3',
//           title: 'English',
//           author: 'NCERT',
//           price: 220,
//           image: 'assets/books/english.jpg',
//           className: 'Class 9',
//           subject: 'English',
//           language: 'English'
//         }
//       ];
//     } finally {
//       this.loading = false;
//     }
//   }

//   private getCoverImage(coverImage: any): string {
//     const url = coverImage?.fields?.file?.url;

//     if (!url) {
//       return 'assets/books/default.jpg';
//     }

//     return url.startsWith('//')
//       ? `https:${url}`
//       : url;
//   }

//   viewDetails(book: SchoolBook): void {
//     this.router.navigate([
//       '/book',
//       book.id
//     ]);
//   }

//   addToCart(book: SchoolBook): void {
//     this.cart.addToCart({
//       id: book.id,
//       title: book.title,
//       author: book.author,
//       price: book.price,
//       image: book.image
//     });
//   }
// }

// 


// import { Component, inject } from '@angular/core';
// import { Router } from '@angular/router';
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
//   selector: 'app-school-books',
//   standalone: true,
//   templateUrl: './school-books.html',
//   styleUrl: './school-books.scss'
// })
// export class SchoolBooks {

//   private router = inject(Router);
//   private contentfulService = inject(ContentfulService);

//   public cart = inject(CartService);

//   books: SchoolBook[] = [];

//   loading = false;
//   error: string | null = null;

//   async ngOnInit(): Promise<void> {
//     await this.loadBooks();
//   }

//   async loadBooks(): Promise<void> {
//     this.loading = true;
//     this.error = null;

//     try {
//       const entries = await this.contentfulService.getNcertBooks();

//       this.books = entries.map((entry) => ({
//         id: entry.sys.id,
//         title: entry.fields.booktitle,
//         author: 'NCERT',
//         price: 250,
//         image: this.getCoverImage(entry.fields.coverimage),
//         className: entry.fields.class,
//         subject: entry.fields.subject,
//         language: entry.fields.lang,
//         description: entry.fields.description,
//         officialUrl: entry.fields.ncerturl,
//         academicYear: entry.fields.academicyear
//       }));

//       console.log('Books loaded from Contentful:', this.books);

//     } catch (err) {
//       console.error('Failed to load school books:', err);

//       this.error = 'Unable to load school books. Please try again.';
//       this.books = [];

//     } finally {
//       this.loading = false;
//     }
//   }

//   private getCoverImage(coverimage: unknown): string {
//     const asset = coverimage as any;

//     const url = asset?.fields?.file?.url;

//     if (!url) {
//       return 'assets/books/default.jpg';
//     }

//     return url.startsWith('//')
//       ? `https:${url}`
//       : url;
//   }

//   viewDetails(book: SchoolBook): void {
//     this.router.navigate([
//       '/book',
//       book.id
//     ]);
//   }

//   addToCart(book: SchoolBook): void {
//     this.cart.addToCart({
//       id: book.id,
//       title: book.title,
//       author: book.author,
//       price: book.price,
//       image: book.image
//     });
//   }
// }

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { ContentfulService } from '../../core/services/contentful.service';

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
  selector: 'app-school-books',
  standalone: true,
  templateUrl: './school-books.html',
  styleUrl: './school-books.scss'
})
export class SchoolBooks {

  private router = inject(Router);
  private contentfulService = inject(ContentfulService);

  public cart = inject(CartService);

  books: SchoolBook[] = [];

  loading = false;
  error: string | null = null;

  async ngOnInit(): Promise<void> {
    await this.loadBooks();
  }

  async loadBooks(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const entries = await this.contentfulService.getNcertBooks();

      this.books = entries.map((entry) => ({
        id: entry.sys.id,

        title: this.getText(entry.fields.booktitle),

        author: 'NCERT',

        price: Number(entry.fields.price),


        image: this.getCoverImage(entry.fields.coverimage),

        className: this.getText(entry.fields.class),

        subject: this.getText(entry.fields.subject),

        language: this.getText(entry.fields.lang),

        description: this.getOptionalText(entry.fields.description),

        officialUrl: this.getOptionalText(entry.fields.ncerturl),

        academicYear: this.getOptionalText(entry.fields.academicyear)
      }));

      // console.log('Contentful books:', this.books);

    } catch (err) {
      console.error('Failed to load school books:', err);

      this.error = 'Unable to load school books. Please try again.';

      this.books = [];

    } finally {
      this.loading = false;
    }
  }

  /**
   * Converts a Contentful field into a normal string.
   *
   * Handles both:
   *   "Mathematics"
   *
   * and localized objects such as:
   *   { "en-US": "Mathematics" }
   */
  private getText(value: unknown): string {
    if (typeof value === 'string') {
      return value;
    }

    if (value && typeof value === 'object') {
      const values = Object.values(value);

      const firstString = values.find(
        item => typeof item === 'string'
      );

      return firstString ?? '';
    }

    return '';
  }

  /**
   * Same as getText(), but allows empty values.
   */
  private getOptionalText(value: unknown): string | undefined {
    const result = this.getText(value);

    return result || undefined;
  }

  /**
   * Gets the image URL from a Contentful Asset.
   */
  private getCoverImage(coverimage: unknown): string {

    if (!coverimage || typeof coverimage !== 'object') {
      return 'assets/books/default.jpg';
    }

    const asset = coverimage as {
      fields?: {
        file?: {
          url?: string;
        };
      };
    };

    const url = asset.fields?.file?.url;

    if (!url) {
      return 'assets/books/default.jpg';
    }

    return url.startsWith('//')
      ? `https:${url}`
      : url;
  }

  viewDetails(book: SchoolBook): void {
    this.router.navigate(
      ['/book'],
      {
        state: {
          book
        }
      }
    );
  }

  addToCart(book: SchoolBook): void {

    this.cart.addToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      image: book.image
    });
  }
}