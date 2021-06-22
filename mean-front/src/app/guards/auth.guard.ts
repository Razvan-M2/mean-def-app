import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private isAuthenticated: Subscription;
  private authStatus: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {
    this.isAuthenticated = this.authService
      .getAuthStatusListener()
      .subscribe((status) => {
        this.authStatus = status;
      });
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const isAuth = this.authService.getIsAuth();
    if (!isAuth) {
      this.matSnackBar.open('Access prohibited.', 'Close', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      this.router.navigate(['/']);
    }
    return isAuth;
  }
}
