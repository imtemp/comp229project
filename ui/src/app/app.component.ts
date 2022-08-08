import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { User } from './models/user';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'My Angular App';

  constructor(
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {
  }

  logout() {
    return this.userService.logout().subscribe(() => {
      // TODO: find a better workaround for resolvers not re-running
      // this.router.navigateByUrl('/');
      // this.snackBar.open('Successfully logged out.', 'Close', {
      //   duration: 2000,
      //   panelClass: ['mat-toolbar', 'mat-primary', 'style-success']
      // });
      location.reload();
    })
  }

  get isAuthenticated() {
    return this.userService.isLoggedIn();
  }
}