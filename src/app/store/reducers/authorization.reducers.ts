import { createReducer, on, Action } from '@ngrx/store'
import * as AuthorizationActions from '../actions/authorization.actions';

export interface State {
    loginPreloader: boolean;
    signUpPreloader: boolean;
}

export const initialState: State = {
    loginPreloader: false,
    signUpPreloader: false
}

const authorizationReducer = createReducer(
    initialState,
    on(AuthorizationActions.SignUpRequestAction, (state) => ({ ...state, signUpPreloader: true })),
    on(AuthorizationActions.SignUpRequestAction, (state) => ({ ...state, signUpPreloader: false })),
    on(AuthorizationActions.SignUpRequestAction, (state) => ({ ...state, signUpPreloader: false })),
    on(AuthorizationActions.LogInRequestAction, state => ({ ...state, loginPreloader: true })),
    on(AuthorizationActions.LogInSuccessAction, state => ({ ...state, loginPreloader: false })),
    on(AuthorizationActions.LogInFailureAction, state => ({ ...state, loginPreloader: false })),
)

export function reducer(state: State | undefined, action: Action) {
    return authorizationReducer(state, action);
}