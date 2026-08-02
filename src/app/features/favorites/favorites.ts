import { Component } from '@angular/core';


@Component({
selector:'app-favorites',
standalone:true,
templateUrl:'./favorites.html'
})
export class Favorites{


books:any[]=[];


constructor(){

const data=
localStorage.getItem('favorites');

if(data){

this.books=JSON.parse(data);

}

}


}