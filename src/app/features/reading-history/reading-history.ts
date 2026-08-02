import { Component } from '@angular/core';


@Component({
selector:'app-reading-history',
standalone:true,
templateUrl:'./reading-history.html'
})
export class ReadingHistory{


history:any[]=[];


ngOnInit(){

const data=
localStorage.getItem('history');


if(data){

this.history=JSON.parse(data);

}

}


}