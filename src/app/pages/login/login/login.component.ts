import { AuthService } from 'src/app/services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule, FormGroupDirective, NgForm, FormBuilder, FormGroup} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

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
  }
  ngOnInit(): void {
  }
  onSubmit() {
    this.authService.login();
    this.router.navigateByUrl('/dashboard');
  }

  get email() { return this.loginForm.get('email'); }


}
