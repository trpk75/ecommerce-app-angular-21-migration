import { Component } from '@angular/core';

@Component({
  selector: 'my-app', 
  standalone: false,
  template : `      
    <router-outlet></router-outlet>  
  `
})
export class AppComponent  {
  name = 'Angular';
  public message: string ='';
 
}
