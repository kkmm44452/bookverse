import { Component } from '@angular/core';
import { OpenLibraryService } from '../../core/services/open-library';


@Component({
selector:'app-authors',
standalone:true,
templateUrl:'./authors.html'
})
export class Authors{


authors:any[]=[];


constructor(
private api:OpenLibraryService
){}


searchAuthor(name:string){

this.api
.searchBooks(name)
.subscribe(res=>{

this.authors=res.docs;

});

}


}