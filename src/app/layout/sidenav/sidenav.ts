import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Menu } from '../../core/services/menu';


@Component({

selector:'app-sidenav',

standalone:true,

imports:[
RouterLink
],

templateUrl:'./sidenav.html',

styleUrl:'./sidenav.scss'

})


export class Sidenav {


constructor(
public menu:Menu
){}



close(){

this.menu.close();

}


}