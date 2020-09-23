import { createSelector } from '@ngrx/store';
import { AppState } from '..';
import { AuthorizationState } from '../reducers/authorization.reducers';

export const selectToken = createSelector(
   (state: AppState) => state.authorization,
   (state: AuthorizationState) => {   
       if (new Date() > state.expireDate) {
           localStorage.clear();
           return null;
       }
       return state.token;
   } 
)