import { Component } from '@angular/core';


@Component({
selector:'app-my-library',
standalone:true,
templateUrl:'./my-library.html'
})
export class MyLibrary{


books:any[]=[];


ngOnInit(){

const library =
localStorage.getItem('library');


if(library){

this.books=JSON.parse(library);

}

}


}