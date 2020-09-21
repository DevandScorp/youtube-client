import { createAction, props } from '@ngrx/store';
import { User } from '../models/authorization.models';

export enum AuthorizationActionTypes {
    SignUpRequest = '[Authorization] Sign Up Request',
    SignUpSuccess = '[Authorization] Sign Up Success',
    SignUpError = '[Authorization] Sign Up Error',
    LogInRequest = '[Authorization] Log In Request',
    LogInSuccess = '[Authorization] Log In Success',
    LogInError = '[Authorization] Log In Error',
}

/** Sign up */
export const SignUpRequestAction = createAction(AuthorizationActionTypes.SignUpRequest, props<User>());
export const SignUpSuccessAction = createAction(AuthorizationActionTypes.SignUpSuccess);
export const SignUpFailureAction = createAction(AuthorizationActionTypes.SignUpError);

/** Log in */
export const LogInRequestAction = createAction(AuthorizationActionTypes.LogInRequest, props<User>());
export const LogInSuccessAction = createAction(AuthorizationActionTypes.LogInSuccess);
export const LogInFailureAction = createAction(AuthorizationActionTypes.LogInError);
