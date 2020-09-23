import { createReducer, on, Action } from '@ngrx/store'
import * as AuthorizationActions from '../actions/authorization.actions';

export interface AuthorizationState {
    token: string;
    expireDate: Date;
    localId: string;
    loginPreloader: boolean;
    signUpPreloader: boolean;
}

export const initialState: AuthorizationState = {
    token: localStorage.getItem('firebase-token'),
    expireDate: new Date(localStorage.getItem('firebase-expire-date')),
    localId: localStorage.getItem('firebase-local-id'),
    loginPreloader: false,
    signUpPreloader: false
}

const authorizationReducer = createReducer(
    initialState,
    on(AuthorizationActions.SignUpRequestAction, state => ({ ...state, signUpPreloader: true })),
    on(AuthorizationActions.SignUpSuccessAction, state => ({ ...state, signUpPreloader: false })),
    on(AuthorizationActions.SignUpFailureAction, state => ({ ...state, signUpPreloader: false })),
    on(AuthorizationActions.LogInRequestAction, state => ({ ...state, loginPreloader: true })),
    on(AuthorizationActions.LogInSuccessAction, (state, response) => ({ ...state, ...response, loginPreloader: false })),
    on(AuthorizationActions.LogInFailureAction, state => ({ ...state, loginPreloader: false })),
)

export function reducer(state: AuthorizationState | undefined, action: Action) {
    return authorizationReducer(state, action);
}