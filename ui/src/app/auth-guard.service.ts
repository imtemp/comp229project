import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
    constructor(
        public auth: UserService,
        public router: Router,
        private snackBar: MatSnackBar,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // TODO: redirect user back after they log in
        if (this.auth.isLoggedIn()) {
            return true;
        }

        this.auth.setRedirectURL(state.url);
        this.router.navigate(['login']).then(_ => {
            this.snackBar.open('This page requires authentication', 'Close', {
                duration: 5000,
                panelClass: ['mat-toolbar', 'mat-warn', 'style-error']
            })
        });

        return false;
    }
}