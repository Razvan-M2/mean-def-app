import { Component, OnDestroy, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmLogoutComponent } from './confirm-logout/confirm-logout.component';
@Component({
  selector: 'app-head-bar',
  templateUrl: './head-bar.component.html',
  styleUrls: ['./head-bar.component.scss'],
})
export class HeadBarComponent implements OnInit, OnDestroy {
  nameUser: string = '';
  userPresent: boolean = false;
  private userDataSubscription: Subscription;
  private userStatusSubscription: Subscription;
  constructor(
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userPresent = this.authService.getIsAuth();
    this.userStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((response: boolean) => {
        this.userPresent = response;
        this.authService.getUser();
      });
    this.userDataSubscription = this.authService
      .getUserAsObservable()
      .subscribe((serviceData: any) => {
        this.nameUser = serviceData.firstName;
      });
    if (this.userPresent) {
      this.authService.getUser();
    }
  }

  ngOnDestroy(): void {
    this.userDataSubscription.unsubscribe();
    this.userStatusSubscription.unsubscribe();
  }

  onRequestLogout(): void {
    const dialogRef = this.dialog.open(ConfirmLogoutComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.authService.logout();
        this.router.navigate(['/']);
      } else {
      }
    });
  }
}
