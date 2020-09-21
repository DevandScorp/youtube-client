import { AuthorizationEffects } from './effects/authorization.effects';
import * as AuthorizationReducer from './reducers/authorization.reducers';

export interface AppState {
    authorization: AuthorizationReducer.State
}

export const reducers = {
    authorization: AuthorizationReducer.reducer
}

export const effects = [
  AuthorizationEffects
]
