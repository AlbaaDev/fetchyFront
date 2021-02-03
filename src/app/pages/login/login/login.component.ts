import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormGroupDirective, NgForm, FormBuilder} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder,
              private authService: AuthService) {
                
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password:  ['', Validators.required]
    });
    // if(this.authService.loggedIn()) {
    //   this.router.navigateByUrl('/dashboard');
    // }
  }

  ngOnInit(): void {
    
  }
  
  onSubmit() {
    var email = this.loginForm.get('email').value;
    var password = this.loginForm.get('password').value;
    this.authService.login(email, password);
  }
}
