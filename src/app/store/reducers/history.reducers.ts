import { createReducer, on, Action } from '@ngrx/store'
import * as HistoryActions from '../actions/history.actions';
import { HistoryElement } from '../models/history.models';

export interface State {
    historyPreloader: boolean;
    historyElements: HistoryElement[];
}

export const initialState: State = {
    historyPreloader: false,
    historyElements: []
}

const historyReducer = createReducer(
    initialState,
    on(HistoryActions.CreateHistoryElementRequestAction, (state) => ({ ...state, historyPreloader: true })),
    on(HistoryActions.CreateHistoryElementSuccessAction, (state, response: HistoryElement) => {
        return {
            ...state,
            historyElements: [...state.historyElements, response],
            historyPreloader: false
        }
    }),
    on(HistoryActions.CreateHistoryElementErrorAction, (state) => ({ ...state, historyPreloader: false })),
)

export function reducer(state: State | undefined, action: Action) {
    return historyReducer(state, action);
}
