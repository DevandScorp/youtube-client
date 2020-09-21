import { createAction, props } from '@ngrx/store';
import { YoutubeElement } from '../models/youtube.models';

export enum YoutubeActionTypes {
  YoutubeSearchRequest = '[Youtube] Youtube Search Request',
  YoutubeSearchSuccess = '[Youtube] Youtube Search Success',
  YoutubeSearchError = '[Youtube] Youtube Search Error'
}

export const YoutubeSearchRequesttAction = createAction(YoutubeActionTypes.YoutubeSearchRequest, props<{ searchString: string, elementsAmount: number, pageToken?: string }>());
export const YoutubeSearchSuccessAction = createAction(YoutubeActionTypes.YoutubeSearchSuccess, props<{ youtubeElements: YoutubeElement[] } >());
export const YoutubeSearchErrorAction = createAction(YoutubeActionTypes.YoutubeSearchError);
