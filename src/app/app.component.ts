import { AuthService } from './services/auth.service';
import { Component, AfterContentInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fetchyFront';
  constructor(private authService: AuthService) {  }
  isAuth() {
    return this.authService.isAuth();
  }
}
