import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, catchError, mergeMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HistoryService } from 'src/app/core/services/history.service';
import { HistoryActionTypes, CreateHistoryElementSuccessAction, CreateHistoryElementErrorAction, GetHistoryElementsSuccessAction, GetHistoryElementsErrorAction } from '../actions/history.actions';
import { HistoryElement } from '../models/history.models';

@Injectable()
export class HistoryEffects {

    constructor(
        private actions$: Actions,
        private historyService: HistoryService,
        private alertService: AlertService
    ) { }

    private _handleHistoryError(error: HttpErrorResponse): void{
        if (error.message) this.alertService.error(error.message);
    }

    createHistoryElement$ = createEffect(() => this.actions$.pipe(
        ofType(HistoryActionTypes.CreateHistoryElementRequest),
        exhaustMap((request: HistoryElement) => {
            return this.historyService.createHistoryElement(request)
                .pipe(
                    map(() => CreateHistoryElementSuccessAction(request)),
                    catchError(() => of(CreateHistoryElementErrorAction()))
                )
        })
    ));

    getHistoryElements$ = createEffect(() => this.actions$.pipe(
        ofType(HistoryActionTypes.GetHistoryElementsRequest),
        mergeMap(() => this.historyService.getHistoryElements().pipe(
            map((historyElements: HistoryElement[]) => GetHistoryElementsSuccessAction({ historyElements })),
            catchError((error: HttpErrorResponse) => {
                this._handleHistoryError(error);
                return of(GetHistoryElementsErrorAction())
            })
        ))
    ))
}