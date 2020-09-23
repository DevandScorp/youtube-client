import { createReducer, on, Action } from '@ngrx/store'
import * as HistoryActions from '../actions/history.actions';
import { HistoryElement } from '../models/history.models';

export interface HistoryState {
    historyPreloader: boolean;
    historyElements: string[];
}

export const initialState: HistoryState = {
    historyPreloader: false,
    historyElements: []
}

const historyReducer = createReducer(
    initialState,
    on(HistoryActions.CreateHistoryElementRequestAction, (state) => (state)),
    on(HistoryActions.CreateHistoryElementSuccessAction, (state, response: HistoryElement) => {
        return {
            ...state,
            historyElements: Array.from(new Set([...state.historyElements, response.query])),
            historyPreloader: false
        }
    }),
    on(HistoryActions.CreateHistoryElementErrorAction, (state) => (state)),
    on(HistoryActions.GetHistoryElementsRequestAction, (state) => ({ ...state, historyPreloader: true })),
    on(HistoryActions.GetHistoryElementsSuccessAction,
        (state, response: { historyElements: HistoryElement[] }) => {
            const localId = localStorage.getItem('firebase-local-id');
            const historyElements = Array.from(new Set(response.historyElements.filter(historyElement => historyElement.localId === localId).map(historyElement => historyElement.query)));
            return { historyElements, historyPreloader: false };
        }),
    on(HistoryActions.GetHistoryElementsRequestAction, (state) => ({ ...state, historyPreloader: true })),
)

export function reducer(state: HistoryState | undefined, action: Action) {
    return historyReducer(state, action);
}
