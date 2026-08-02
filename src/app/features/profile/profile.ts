import { Component } from '@angular/core';


@Component({
selector:'app-profile',
standalone:true,
templateUrl:'./profile.html',
styleUrl:'./profile.scss'
})
export class Profile {


user={

name:'Book Lover',

email:'reader@bookverse.com',

avatar:'👤'

};



favorites=0;

library=0;



constructor(){


const fav =
localStorage.getItem('favorites');


const lib =
localStorage.getItem('library');


this.favorites =
fav ? JSON.parse(fav).length : 0;


this.library =
lib ? JSON.parse(lib).length : 0;


}



}