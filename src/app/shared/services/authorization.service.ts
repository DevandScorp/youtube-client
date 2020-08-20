import { AlertService } from './alert.service';
import { User, FirebaseAuthorizationResponse } from './../interfaces';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {

  expireDate: Date;
  constructor(private http: HttpClient, private alertService: AlertService) { }

  isAuthorized(): boolean {
    return !!this.token;
  }
  get localId(): string {
    return localStorage.getItem('firebase-local-id');
  }
  get token(): string {
    const expDate = new Date(localStorage.getItem('firebase-expire-date'));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('firebase-token');
  }

  logout(): void {
    this.setToken(null);
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`, user)
      .pipe(
        tap(this.setToken.bind(this)),
        catchError(this.handleError.bind(this))
      );
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    const { message } = error.error.error;

    switch (message) {
      case 'INVALID_EMAIL':
        this.alertService.error('Неверный email');
        break;
      case 'INVALID_PASSWORD':
        this.alertService.error('Неверный пароль');
        break;
      case 'EMAIL_NOT_FOUND':
        this.alertService.error('Такого email не существует');
        break;
      case 'EMAIL_EXISTS':
        this.alertService.error('Данный email уже зарегистрирован в системе');
        break;
      case 'OPERATION_NOT_ALLOWED':
        this.alertService.error('Вход с паролем отключен для этого проекта');
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        this.alertService.error('Слишком много попыток. Попробуйте позже');
        break;
    }

    return throwError(error);
  }
  private setToken(response: FirebaseAuthorizationResponse | null): void {
    if (response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000)
      localStorage.setItem('firebase-token', response.idToken);
      localStorage.setItem('firebase-expire-date', expDate.toString());
      localStorage.setItem('firebase-local-id', response.localId);
    } else {
      localStorage.clear();
    }
  }
  signUp(user: User): Observable<any> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`, user)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
}
