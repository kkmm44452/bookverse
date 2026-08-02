import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector:'app-navbar',
  standalone:true,
    imports:[
    FormsModule
  ],
  templateUrl:'./navbar.html',
  styleUrl:'./navbar.scss'
})
export class Navbar {

  searchText = '';
genres = [

'Fiction',
'Fantasy',
'Romance',
'Mystery',
'Sci-Fi',
'History',
'Biography',
'Horror'

];

constructor(
private router:Router
){}

openGenre(genre:string){

this.router.navigate(
['/search'],
{
queryParams:{
genre:genre
}
}
);

}

  openProfile(){

    this.router.navigate(['/profile']);

  }


 searchBooks(){

    if(this.searchText.trim()){

      this.router.navigate(
        ['/search'],
        {
          queryParams:{
            q:this.searchText
          }
        }
      );

    }

  }

}