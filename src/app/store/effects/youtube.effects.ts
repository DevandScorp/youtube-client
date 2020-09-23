import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { YoutubeActionTypes, YoutubeSearchSuccessAction, YoutubeSearchErrorAction } from '../actions/youtube.actions';
import { YoutubeService } from 'src/app/core/services/youtube.service';
import { exhaustMap, map, mergeMap, catchError } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';
import { YoutubeElement } from '../models/youtube.models';
import { AlertService } from 'src/app/core/services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from '..';
import { CreateHistoryElementRequestAction } from '../actions/history.actions';

@Injectable()
export class YoutubeEffects {

    constructor(
        private actions$: Actions,
        private youtubeService: YoutubeService,
        private alertService: AlertService,
        private store: Store<AppState>
    ) { }

    search$ = createEffect(() => this.actions$.pipe(
        ofType(YoutubeActionTypes.YoutubeSearchRequest),
        exhaustMap((request: { searchString: string, elementsAmount: number, pageToken?: string }) => {
            return this.youtubeService.searchVideoSnippet(request.searchString, request.elementsAmount, request.pageToken)
            .pipe(
                mergeMap(response => {
                    const nextPageToken = response.nextPageToken || '';
                    const prevPageToken = response.prevPageToken || '';
                    const youtubeVideoSnippets = response.items;
                    return forkJoin(youtubeVideoSnippets.map(youtubeVideoSnippet => this.youtubeService.getVideoStatistics(youtubeVideoSnippet.id.videoId))).pipe(
                        map((snippets: any[]) => {
                            console.log('before youtube resulting array');
                            const youtubeResultingArray: YoutubeElement[] = snippets.map((snippet, index) => {
                                const statistics = snippet.items[0]?.statistics;
                                return {
                                    name: youtubeVideoSnippets[index].snippet.title,
                                    creation_date: new Date(youtubeVideoSnippets[index].snippet.publishedAt),
                                    view_count: statistics ? +statistics.viewCount || 0 : 0,
                                    like_count: statistics ? +statistics.likeCount || 0 : 0,
                                    dislike_count: statistics ? +statistics.dislikeCount || 0 : 0,
                                    comment_count: statistics ? +statistics.commentCount || 0 : 0,
                                    image_url: youtubeVideoSnippets[index].snippet.thumbnails.high.url || '/assets/not-found.svg'
                                }
                            });
                            console.log('before dispatch');
                            this.store.dispatch(CreateHistoryElementRequestAction({ query: request.searchString, localId: localStorage.getItem('firebase-local-id') }));
                            console.log('after dispatch');
                            return YoutubeSearchSuccessAction({ youtubeElements: youtubeResultingArray, nextPageToken, prevPageToken });
                        })
                    );
                }),
                catchError((error: HttpErrorResponse) => {
                    if (error.message) this.alertService.error(error.message);
                    return of(YoutubeSearchErrorAction());
                })
            )
        })
    ));
}