import { AlertService } from './alert.service';
import { User, FirebaseAuthorizationResponse } from './../interfaces';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {

  token: string = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImFmMDg2ZmE4Y2Q5NDFlMDY3ZTc3NzNkYmIwNDcxMjAxMTBlMDA1NGEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcHN5Y2hlZC1tZXRyaWNzLTI1NDIxMSIsImF1ZCI6InBzeWNoZWQtbWV0cmljcy0yNTQyMTEiLCJhdXRoX3RpbWUiOjE1OTcxNzM4MTYsInVzZXJfaWQiOiJtZVdpdkF5R0hjVGdHQ2w0aVp1V3k3Z05VNHMxIiwic3ViIjoibWVXaXZBeUdIY1RnR0NsNGladVd5N2dOVTRzMSIsImlhdCI6MTU5NzE3MzgxNiwiZXhwIjoxNTk3MTc3NDE2LCJlbWFpbCI6ImFydGVtZGE0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhcnRlbWRhNEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.UlGe3bdlF2oqB_DIKsGtC-2z_7Lv1dsPnhCQjokVOVhZvwnz6RNG9KOpUVJBfIbhiB_UMsBd_m_EYIe-CSu_WtqYdoowjG7kGNLNfZaNxYstYU1Pwnhr3Akc8wHy_Br3Cv0f2Gsx04KPgLCKfPHZFulOSuRdRoZkY7W9df28KZkt2m_cojIq7kUDUmXMWbVeSYZjIIjUEbLkgG9YF6kgtRpdhXhB10V3zetSXVXA4ECbFqwykVI5CWgBWWC2ZeNVDYSBNfMxzF7SkmPcRHABnKHGbVaxEH7KGzBOPErm4DuWPUo9Fu3rpdeh5fmZ16xt7luHYCwPOoSbvB6L6KE5hg';
  expireDate: Date;
  localId: string;
  constructor(private http: HttpClient, private alertService: AlertService) { }

  isAuthorized(): boolean {
    return !!this.token;
  }
  getToken(): string {
    const expireDate = new Date(this.expireDate);
    if (new Date() > expireDate) {
      this.logout();
      return null;
    }
    return this.token;
  }

  logout(): void {
    this.token = null;
    this.expireDate = null;
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
      this.token = response.idToken;
      this.expireDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
      this.localId = response.localId;
    } else {
      this.token = null;
      this.expireDate = null;
    }
  }
  signUp(user: User): Observable<any> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`, user)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
}
