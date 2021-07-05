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
export class RoleGuard implements CanActivate {
  userRoleSubscription: Subscription;
  userRole: string;
  constructor(
    private authService: AuthService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {
    this.userRoleSubscription = this.authService
      .getRoleTypeListener()
      .subscribe((role) => {
        this.userRole = role;
      });
  }
  ngOnDestroy(): void {
    this.userRoleSubscription.unsubscribe();
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const userRole = this.userRole !== 'user';
    if (!userRole) {
      console.log('Role not good');
      this.matSnackBar.open('Access Prohibited', 'Close', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

      this.router.navigate(['/']);
    }
    return userRole;
  }
}
