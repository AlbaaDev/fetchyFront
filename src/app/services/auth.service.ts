import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: boolean;
  isAuth() {
    return this.isAuthenticated;
  }
  login() {
    if (!this.isAuth()) {
      this.isAuthenticated = true;
    }
  }
  logout() {
    if (this.isAuth()) {
      this.isAuthenticated = false;
    }
  }
  constructor() { }
}
