import { Component, OnInit } from '@angular/core';
import { OpenLibraryService } from '../../core/services/open-library';


@Component({
selector:'app-categories',
standalone:true,
templateUrl:'./categories.html'
})
export class Categories implements OnInit{


books:any[]=[];


constructor(
private openLibrary:OpenLibraryService
){}


ngOnInit(){

this.openLibrary
.searchBooks('fantasy')
.subscribe(res=>{

this.books=res.docs.slice(0,10);

});

}


}