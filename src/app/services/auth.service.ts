import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: boolean = false;

  constructor(private router: Router, private http: HttpClient) {
    
  }

  login(email: string, password: string) {
    if (!this.loggedIn()) {
      this.http.post<{jwt: string}>('http://localhost:8080/users/authenticate', 
                     {email, password})
               .subscribe((res) => {
                  localStorage.setItem('jwt', res.jwt);
                  this.router.navigateByUrl('/dashboard');
               });
    }
  }

  logout() {
    if (this.loggedIn()) {
      localStorage.removeItem('jwt');
      this.router.navigateByUrl('/home');
    }
  }

  register(email: string, password: string) {
    this.http.post<{jwt: string}>('http://localhost:8080/users/register', 
      {email, password});
      this.router.navigateByUrl('/login');
  }
 
  loggedIn(): boolean{
    return localStorage.getItem('jwt') !==  null;
  }
}
