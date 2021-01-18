import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder, FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';

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
  hide  = true;
  hide2 = true;
  signUpForm: FormGroup;
  constructor(private router: Router, private formBuilder: FormBuilder) {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validator: passwordMatchValidator });
  }
  // passwordMatchValidator(form: FormGroup) {
  //   return form.get('password').value === form.get('confirmPassword').value ? null : {mismatch: true};
  // }
  ngOnInit(): void {
  }
  onSubmit() {
  }

  get firstName() { return this.signUpForm.get('firstName'); }
  get lastName() { return this.signUpForm.get('lastName'); }
  get email() { return this.signUpForm.get('email'); }
  get password() { return this.signUpForm.get('password'); }
  get confirmPassword() { return this.signUpForm.get('confirmPassword'); }
}
