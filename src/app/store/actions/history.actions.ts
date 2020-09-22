import { createAction, props } from '@ngrx/store';
import { HistoryElement } from '../models/history.models';

export enum HistoryActionTypes {
  CreateHistoryElementRequest = '[History] Create History Element Request',
  CreateHistoryElementSuccess = '[History] Create History Element Success',
  CreateHistoryElementError = '[History] Create History Element Error'
}

export const CreateHistoryElementRequestAction = createAction(HistoryActionTypes.CreateHistoryElementRequest, props<HistoryElement>());
export const CreateHistoryElementSuccessAction = createAction(HistoryActionTypes.CreateHistoryElementSuccess, props<HistoryElement>());
export const CreateHistoryElementErrorAction = createAction(HistoryActionTypes.CreateHistoryElementError);
