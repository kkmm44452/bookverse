import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OpenLibraryService } from '../../core/services/open-library';
import { Router } from '@angular/router';
import { SearchService } from '../../core/services/search';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {


  books: any[] = [];

  loading = false;


  constructor(
    private openLibrary: OpenLibraryService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private searchService: SearchService,


  ) { }



  ngOnInit(): void {

    this.loadBooks();

    this.searchService.search$
      .subscribe(
        (value) => {

          this.searchBooks(value);

        });


  }

  searchBooks(query: string) {


    this.loading = true;


    this.openLibrary
      .searchBooks(query)
      .subscribe({

        next: (response) => {


          this.books = response.docs.slice(0, 12);

          this.loading = false;

          this.cdr.detectChanges();


        },


        error: () => {
          
          this.loading = false;

        }

      });


  }


  loadBooks() {

    this.loading = true;


    this.openLibrary
      .searchBooks('fiction')
      .subscribe({

        next: (response) => {


          this.books = response.docs.slice(0, 12);


          this.loading = false;
          this.cdr.detectChanges();

        },


        error: (error) => {


          console.error(
            'Book loading failed',
            error
          );


          this.loading = false;
          this.cdr.detectChanges();


        }


      });


  }



  getCover(book: any) {


    if (book.cover_i) {

      return `
      https://covers.openlibrary.org/b/id/
      ${book.cover_i}-M.jpg
      `.replace(/\s/g, '');

    }


    return 'assets/no-book-cover.png';

  }

  openBook(book: any) {

    const id = book.key.replace('/works/', '');

    this.router.navigate([
      '/book',
      id
    ]);

  }

}