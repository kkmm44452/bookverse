import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OpenLibraryService } from '../../core/services/open-library';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-details.html',
  styleUrl: './book-details.scss'
})
export class BookDetails implements OnInit {


  book: any = null;
  loading = true;

  authorName = 'Unknown Author';

  constructor(
    private route: ActivatedRoute,
    private api: OpenLibraryService,
    private cdr: ChangeDetectorRef
  ) { }



  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');


     console.log("Book ID:", id);



    if (id) {

      this.api.getBookDetails(id)
        .subscribe({

          next: (response) => {

             console.log("Book Data:", response);


            this.book = response;

            this.loading = false;

            this.cdr.detectChanges();


            if (response.authors?.length) {


              this.getAuthor(
                response.authors[0].author.key
              );


            }



          },


          error: (error) => {

            console.error(
              "Book API Error:",
              error
            );


            this.loading = false;

          }


        });

    }

  }

  getAuthor(key: string) {


    const id = key.replace('/authors/', '');


    this.api
      .getAuthor(id)
      .subscribe(author => {


        this.authorName = author.name;


      });


  }

  getCover() {

    if (this.book?.covers) {

      return `https://covers.openlibrary.org/b/id/${this.book.covers[0]}-L.jpg`;

    }


    return 'assets/no-book-cover.png';

  }

 getCovers(): string[] {
  if (this.book?.covers?.length) {
    return this.book.covers
      .filter((id: number) => id !== -1)
      .map((id: number) => `https://covers.openlibrary.org/b/id/${id}-L.jpg`);
  }

  return ['assets/no-book-cover.png'];
}

currentCoverIndex = 0;

previousCover(): void {
  if (this.currentCoverIndex > 0) {
    this.currentCoverIndex--;
  }
}

nextCover(): void {
  const covers = this.getCovers();

  if (this.currentCoverIndex < covers.length - 1) {
    this.currentCoverIndex++;
  }
}

goToCover(index: number): void {
  this.currentCoverIndex = index;
}


  getDescription(): string {
    if (!this.book?.description) {
      return 'No description available.';
    }

    if (typeof this.book.description === 'string') {
      return this.book.description;
    }

    return this.book.description.value ?? 'No description available.';
  }


  addToFavorites() {

    let favorites = JSON.parse(
      localStorage.getItem('favorites') || '[]'
    );

    const exists = favorites.some(
      (b: any) => b.key === this.book.key
    );

    if (!exists) {

      favorites.push(this.book);

      localStorage.setItem(
        'favorites',
        JSON.stringify(favorites)
      );

      alert('❤️ Book added to Favorites');

    } else {

      alert('This book is already in Favorites.');

    }

  }

  addToLibrary() {

    let library = JSON.parse(
      localStorage.getItem('library') || '[]'
    );

    const exists = library.some(
      (b: any) => b.key === this.book.key
    );

    if (!exists) {

      library.push(this.book);

      localStorage.setItem(
        'library',
        JSON.stringify(library)
      );

      alert('📚 Book added to My Library');

    } else {

      alert('This book is already in your Library.');

    }

  }

  readBook() {

    if (this.book?.key) {

      const workId = this.book.key.replace('/works/', '');

      window.open(
        `https://openlibrary.org${this.book.key}`,
        '_blank'
      );

    }

  }

  purchaseBook() {

    const title = encodeURIComponent(this.book.title);

    window.open(
      `https://www.google.com/search?tbm=shop&q=${title}+book`,
      '_blank'
    );

  }



}