import { createEffect, Actions, ofType } from '@ngrx/effects';
import { AuthorizationService } from 'src/app/core/services/authorization.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthorizationActionTypes, LogInRequestAction, LogInSuccessAction, LogInFailureAction, SignUpSuccessAction, SignUpFailureAction } from '../actions/authorization.actions';
import { map, catchError, exhaustMap } from 'rxjs/operators';
import { User, FirebaseAuthorizationResponse } from '../models/authorization.models';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthorizationEffects {

    constructor(
        private actions$: Actions,
        private authorizationService: AuthorizationService,
        private alertService: AlertService,
        private router: Router
    ) { }

    private _handleError(error: HttpErrorResponse) {
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
    }

    signUp$ = createEffect(() => this.actions$.pipe(
        ofType(AuthorizationActionTypes.SignUpRequest),
        exhaustMap((request: User) => {
            return this.authorizationService.signUp(request).pipe(
                map(() => {
                    this.alertService.success('Вы успешно зарегистрировались в системе');
                    this.router.navigateByUrl('/login');
                    return SignUpSuccessAction();
                }),
                catchError((error: HttpErrorResponse) => {
                    this._handleError(error);
                    return of(SignUpFailureAction());
                })
            )
        })
    ));

    logIn$ = createEffect(() => this.actions$.pipe(
        ofType(AuthorizationActionTypes.LogInRequest),
        exhaustMap((request: User) => {
            console.log(request);
            return this.authorizationService.login(request).pipe(
                map((response: FirebaseAuthorizationResponse) => {
                    const expireDate = new Date(new Date().getTime() + +response.expiresIn * 1000)
                    localStorage.setItem('firebase-token', response.idToken);
                    localStorage.setItem('firebase-expire-date', expireDate.toString());
                    localStorage.setItem('firebase-local-id', response.localId);
                    this.alertService.success('Вы успешно вошли в систему');
                    this.router.navigateByUrl('/');
                    return LogInSuccessAction({ token: response.idToken, expireDate: expireDate, localId: response.localId });
                }),
                catchError((error: HttpErrorResponse) => {
                    this._handleError(error);
                    return of(LogInFailureAction());
                })
            )
        })
    ))
}
