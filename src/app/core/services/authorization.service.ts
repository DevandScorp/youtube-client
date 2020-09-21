import { AlertService } from './alert.service';
import { User, FirebaseAuthorizationResponse } from '../../interfaces';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class AuthorizationService {

  expireDate: Date;
  constructor(private http: HttpClient, private alertService: AlertService) { }

  isAuthorized(): boolean {
    return !!this.getToken();
  }
  getLocalId(): string {
    return localStorage.getItem('firebase-local-id');
  }
  getToken(): string {
    const expDate = new Date(localStorage.getItem('firebase-expire-date'));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('firebase-token');
  }

  logout(): void {
    localStorage.clear();
  }

  login(user: User): Observable<any> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`, { ...user, returnSecureToken: true });
  }
  signUp(user: User): Observable<any> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`, user);
  }
}
