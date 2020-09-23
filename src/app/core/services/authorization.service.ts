import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { User } from 'src/app/store/models/authorization.models';

@Injectable()
export class AuthorizationService {

  constructor(private http: HttpClient) { }

  login(user: User): Observable<any> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`, { ...user, returnSecureToken: true });
  }
  
  signUp(user: User): Observable<any> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`, user);
  }
}
