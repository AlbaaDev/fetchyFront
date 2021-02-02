import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: boolean = false;

  constructor(private http: HttpClient) {
    
  }
  
  isAuth() {
    return this.isAuthenticated;
  }
  login() {
    if (!this.isAuth()) {
      this.http.post<User>('http://localhost:8080/users/authenticate', 
        {"userName" : "titi", "password" : "12345678910"})
        .subscribe(data => console.log(data));
    }
    this.isAuthenticated = true;
  }
  logout() {
    if (this.isAuth()) {
      this.isAuthenticated = false;
    }
  }
  
}
