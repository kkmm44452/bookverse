import { Component } from '@angular/core';


@Component({
selector:'app-settings',
standalone:true,
templateUrl:'./settings.html'
})
export class Settings{


darkMode=false;


toggle(){

this.darkMode=!this.darkMode;

}


}