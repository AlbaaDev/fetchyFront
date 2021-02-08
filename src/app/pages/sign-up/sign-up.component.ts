import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder, FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { MustMatch } from "src/app/validators/MustMatch";
import { AuthService } from 'src/app/services/auth.service';

export class ConfirmPasswordStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      return (control && control.parent.get('password').value !== control.parent.get('confirmPassword')
            .value && control.dirty);
    }
}

export const passwordMatchValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value === confirmPassword.value ?  null : { mismatch: true };
};

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  passwordsMatcher = new ConfirmPasswordStateMatcher();
  submited = false;
  hide  = true;
  hide2 = true;
  signUpForm: FormGroup;
  constructor(private router: Router, private authService: AuthService, 
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  onSubmit() {
    this.submited = true;
    if(this.signUpForm.invalid) {
      console.log("form invalid");
      return;
    }
    var email = this.signUpForm.get('email').value;
    var password = this.signUpForm.get('password').value;
    this.authService.register(email, password);
  }

  get f() { return this.signUpForm.controls; }
  get email() { return this.signUpForm.get('email'); }
  get password() { return this.signUpForm.get('password'); }
  get confirmPassword() { return this.signUpForm.get('confirmPassword'); }
}
