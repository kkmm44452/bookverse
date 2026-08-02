import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenLibraryService {

  private apiUrl = 'https://openlibrary.org';

private popularBooks:any[] = ['haeey','fiction'];

  constructor(private http: HttpClient) {}

  // Search books
  // searchBooks(query: string): Observable<any> {
  //   return this.http.get(
  //     `${this.apiUrl}/search.json?q=${query}`
  //   );
  // }
searchBooks(query:string){

return this.http.get<any>(
`${this.apiUrl}/search.json?q=${query}`
);

}

  // Get book details
  getBookDetails(bookId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/works/${bookId}.json`
    );
  }


  // Get author information
  getAuthor(authorId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/authors/${authorId}.json`
    );
  }


  // Get cover image
  getCoverImage(coverId: number, size: string = 'M'): string {

    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;

  }

   searchByGenre(genre:string):Observable<any>{

    return this.http.get(
      `${this.apiUrl}/search.json?subject=${genre}`
    );

  }

// getBookDetails(id:string){

//   return this.http.get(
//     `${this.apiUrl}/works/${id}.json`
//   );

// }

// getAuthor(id:string){

// return this.http.get(
// `${this.apiUrl}/authors/${id}.json`
// );

// }

}