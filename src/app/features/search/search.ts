import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OpenLibraryService } from '../../core/services/open-library';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
selector:'app-search',
standalone:true,
  imports: [
    CommonModule,
    FormsModule
  ],
templateUrl:'./search.html',
styleUrl:'./search.scss'
})
export class Search {


books:any[]=[];

query = '';

// books: any[] = [];

loading = false;

constructor(
  private api: OpenLibraryService,
  private router: Router
) {}

searchBooks() {

  if (!this.query.trim()) return;

  this.loading = true;

  this.api.searchBooks(this.query)
    .subscribe(res => {

      this.books = res.docs;

      this.loading = false;

    });

}

getCover(book: any) {

  if (book.cover_i) {

    return `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;

  }

  return 'assets/no-book-cover.png';

}

openBook(book: any) {

  const id = book.key.replace('/works/', '');

  this.router.navigate(['/book', id]);

}


// constructor(
// private api:OpenLibraryService,
// private route:ActivatedRoute
// ){


// this.route.queryParams.subscribe(params => {


//   if(params['q']){

//     this.search(params['q']);

//   }


//   if(params['genre']){

//     this.searchGenre(params['genre']);

//   }


// });



// this.route.queryParams
// .subscribe(params=>{


// if(params['genre']){


// this.searchGenre(params['genre']);


// }


// });




// }



// search(text:string){

// this.api
// .searchBooks(text)
// .subscribe(res=>{


// this.books=res.docs.slice(0,20);


// });


// }




// searchGenre(genre:string){


// this.api
// .searchByGenre(genre)
// .subscribe(res=>{


// this.books=res.works?.slice(0,20)
// || res.docs.slice(0,20);


// });


// }



// getCover(book:any){

// return book.cover_i

// ?
// `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`

// :
// 'assets/no-book-cover.png';


// }


}