import { createReducer, on, Action } from '@ngrx/store'
import * as YoutubeActions from '../actions/youtube.actions';
import { YoutubeElement } from '../models/youtube.models';

export interface YoutubeState {
  youtubeSearchPreloader: boolean;
  youtubeElements: YoutubeElement[];
}

export const initialState: YoutubeState = {
  youtubeSearchPreloader: false,
  youtubeElements: []
}

const youtubeReducer = createReducer(
  initialState,
  on(YoutubeActions.YoutubeSearchRequestAction, (state) => ({ ...state, youtubeSearchPreloader: true })),
  on(YoutubeActions.YoutubeSearchSuccessAction, (state, response) => {
    return {
    ...state,
    youtubeSearchPreloader: false,
    youtubeElements: response.youtubeElements
  }}),
  on(YoutubeActions.YoutubeSearchErrorAction, (state) => ({ ...state, youtubeSearchPreloader: false })),
)

export function reducer(state: YoutubeState | undefined, action: Action) {
  return youtubeReducer(state, action);
}
