import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { LoginModule } from "./features/login/login.module";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, LoginModule], 
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'tic-frontend-angular';

  constructor() {
    
  }

}
