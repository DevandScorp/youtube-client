import { createReducer, on, Action } from '@ngrx/store'
import * as YoutubeActions from '../actions/youtube.actions';
import { YoutubeElement } from '../models/youtube.models';

export interface State {
  youtubeSearchPreloader: boolean;
  youtubeElements: YoutubeElement[];
}

export const initialState: State = {
  youtubeSearchPreloader: false,
  youtubeElements: []
}

const youtubeReducer = createReducer(
  initialState,
  on(YoutubeActions.YoutubeSearchRequesttAction, (state) => ({ ...state, youtubeSearchPreloader: true })),
  on(YoutubeActions.YoutubeSearchSuccessAction, (state) => ({ ...state, youtubeSearchPreloader: false })),
  on(YoutubeActions.YoutubeSearchErrorAction, (state) => ({ ...state, youtubeSearchPreloader: false })),
)

export function reducer(state: State | undefined, action: Action) {
  return youtubeReducer(state, action);
}
