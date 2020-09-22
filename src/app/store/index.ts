import { AuthorizationEffects } from './effects/authorization.effects';
import * as AuthorizationReducer from './reducers/authorization.reducers';
import * as YoutubeReducer from './reducers/youtube.reducers';
import * as HistoryReducer from './reducers/history.reducers';
import { YoutubeEffects } from './effects/youtube.effects';
import { HistoryEffects } from './effects/history.effects';

export interface AppState {
    authorization: AuthorizationReducer.State,
    youtube: YoutubeReducer.State,
    history: HistoryReducer.State
}

export const reducers = {
    authorization: AuthorizationReducer.reducer,
    youtube: YoutubeReducer.reducer,
    history: HistoryReducer.reducer
}

export const effects = [
  AuthorizationEffects,
  YoutubeEffects,
  HistoryEffects
]
