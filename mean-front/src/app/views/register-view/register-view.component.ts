import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { MustMatch } from './register-form-validators/MustMatch';

@Component({
  selector: 'app-register-view',
  templateUrl: './register-view.component.html',
  styleUrls: ['./register-view.component.scss'],
})
export class RegisterViewComponent implements OnInit {
  registerForm: FormGroup;
  hideConfirmPassword = true;
  hidePassword = true;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private matSnackBar: MatSnackBar
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-Z]+$')]],
      lastName: ['', [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-Z\-]+$')]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: [
        '',
        [Validators.required, Validators.minLength(7), Validators.maxLength(20),Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$')],
      ],
      confirmPassword: [
        '',
        [Validators.required, Validators.minLength(7), Validators.maxLength(20)],
      ],
    },      {
      validators: MustMatch,
    });
  }

  ngOnInit(): void {}

  get passwordInput() { return this.registerForm.get('password'); }
  get confirmPasswordInput() { return this.registerForm.get('confirmPassword'); }

  onInvalidSubmit():void{
    this.matSnackBar.open('Access prohibited.', 'Close', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  onSubmitForm(): void {
    if (!this.registerForm.valid) {
      console.log('Inputs invalid!');
      console.log(this.registerForm.errors);
      return;
    }
    console.log(this.registerForm.value);
    this.authService.register(this.registerForm.value);
  }
}
