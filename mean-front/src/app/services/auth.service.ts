import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UserFormData } from '../models/UserFormData';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  private tokenExpire: Date;
  private authStatusListener = new Subject<boolean>();
  private userUpdated = new Subject<any>();
  private isAuthenticated = false;
  private tokenTimer: any;
  private userRole: string;

  constructor(private httpClient: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserRole() {
    return this.userRole;
  }

  login(authData: UserFormData) {
    const endPoint = '/api/login';

    this.httpClient
      .post<{ success: boolean; token: string; tokenExpire: number }>(
        environment.apiUrl + endPoint,
        authData
      )
      .subscribe(
        (response: {
          success: boolean;
          token: string;
          tokenExpire: number;
        }) => {
          this.token = response.token;
          this.tokenExpire = new Date(Date.now() + response.tokenExpire * 1000);
          this.authStatusListener.next(true);
          this.setAuthTimer(response.tokenExpire);
          //  Expiration maintenance in front?
          this.setLocalStorage();
          this.getUser();
          this.router.navigate(['/']);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    } else {
      this.clearLocalStorage();
      this.token = '';
      this.tokenExpire = null;
    }
  }

  register(userData: UserFormData) {
    const endPoint = '/api/register';

    this.httpClient
      .post(environment.apiUrl + endPoint, userData)
      .subscribe((response: { success: boolean; message: string }) => {
        if (response.success) this.router.navigate(['/login']);
        else {
          console.log(response.message);
        }
      });
  }

  setLocalStorage(): void {
    localStorage.setItem('token', this.token);
    localStorage.setItem('expiration', this.tokenExpire.getTime().toString());
  }

  clearLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearLocalStorage();
    this.router.navigate(['/']);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return null;
    }
    return {
      token,
      expirationDate: parseInt(expirationDate),
      userId: userId,
    };
  }

  getUserAsObservable() {
    return this.userUpdated.asObservable();
  }

  getUser() {
    const endPoint = '/api/auth/details';
    this.httpClient
      .get<{ success: boolean; data: any }>(environment.apiUrl + endPoint)
      .pipe(
        map((resData: { success: boolean; data: any }) => {
          this.userRole = resData.data.role;
          return resData.data;
        })
      )
      .subscribe((extractedData: string) => {
        this.userUpdated.next(extractedData);
      });
  }
}
