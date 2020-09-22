import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HistoryService } from 'src/app/core/services/history.service';
import { HistoryActionTypes, CreateHistoryElementSuccessAction, CreateHistoryElementErrorAction } from '../actions/history.actions';
import { HistoryElement } from '../models/history.models';

@Injectable()
export class HistoryEffects {

    constructor(
        private actions$: Actions,
        private historyService: HistoryService,
        private alertService: AlertService
    ) { }

    createHistoryElement$ = createEffect(() => this.actions$.pipe(
        ofType(HistoryActionTypes.CreateHistoryElementRequest),
        exhaustMap((request: HistoryElement) => {
            return this.historyService.createHistoryElement(request)
            .pipe(
                map(() => {
                    return CreateHistoryElementSuccessAction(request);
                }),
                catchError(() => {
                    return of(CreateHistoryElementErrorAction());
                })
            )
        })
    ));
}