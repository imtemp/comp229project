import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    username: new FormControl('', []),
  });

  registrationMode: boolean = false;
  showSpinner: boolean = false;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService) {
  }

  ngOnInit(): void {
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get username() {
    return this.loginForm.get('username');
  }


  toggleRegistrationMode() {
    this.registrationMode = !this.registrationMode;

    if (this.registrationMode) {
      this.username.setValidators(Validators.required);
      this.username.updateValueAndValidity();
    } else {
      this.username.setValidators([]);
      this.username.updateValueAndValidity();
    }
  }

  login() {
    if (!this.loginForm.valid) {
      return;
    }

    this.userService.login(this.email.value, this.password.value)
      .subscribe(_ => {
        this.router.navigateByUrl(this.userService.extractRedirectUrl() || '/');
      }, e => {
        this.snackBar.open(`Error: ${e.error.error}`, 'Close', {
          duration: 5000,
          panelClass: ['mat-toolbar', 'mat-warn', 'style-error']
        });
      })
  }

  register() {
    if (!this.loginForm.valid) {
      return;
    }

    this.userService.register(
      new User(null, this.username.value, this.email.value),
      this.password.value
    ).subscribe(res => {
      this.router.navigateByUrl('/')
    }, e => {
      this.snackBar.open(`Error: ${e.error.error}`, 'Close', {
        duration: 5000,
        panelClass: ['mat-toolbar', 'mat-warn', 'style-error']
      });
    });
  }
}
