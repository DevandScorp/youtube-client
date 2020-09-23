import { AuthorizationService } from '../../core/services/authorization.service';
import { HistoryService } from '../../core/services/history.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { HistoryElement } from '../../store/models/history.models';
import { AlertService } from '../../core/services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { YoutubeSearchRequestAction, YoutubeActionTypes } from 'src/app/store/actions/youtube.actions';
import { Actions, ofType } from '@ngrx/effects';
import { GetHistoryElementsRequestAction } from 'src/app/store/actions/history.actions';
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  searchString: string;
  elementsAmount: number;
  showSearchHistory = false;
  swipeCoord: number[];
  swipeDirection: string;

  nextPageToken: string;
  prevPageToken: string;

  historyElements: HistoryElement[];

  youtube$ = this.store.select(state => state.youtube);

  history$ = this.store.select(state => state.history);

  constructor(
    private store: Store<AppState>,
    private authorizationService: AuthorizationService,
    private router: Router,
    private actions$: Actions) { }

  ngOnInit(): void {
    this.actions$.pipe(
      ofType(YoutubeActionTypes.YoutubeSearchSuccess),
    ).subscribe((result: {nextPageToken: string, prevPageToken: string }) => {
      this.nextPageToken = result.nextPageToken;
      this.prevPageToken = result.prevPageToken;
    })
    this.setSize();
    this.store.dispatch(GetHistoryElementsRequestAction());
  }
  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
  setSearchHistory(query: string): void {
    this.searchString = query;
    this.swipeDirection = '';
    this.search();
  }
  swipeMouse(event: MouseEvent, when: string): void {
    const coord: [number, number] = [event.clientX, event.clientY];
    if (when === 'start') {
      this.swipeCoord = coord;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      if (Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {
        this.swipeDirection = direction[0] < 0 ? 'next' : 'previous';
        if (this.searchString) {
          this.search();
        }
      }
    }
  }
  swipe(event: TouchEvent, when: string): void {
    const coord: [number, number] = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
    if (when === 'start') {
      this.swipeCoord = coord;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      if (Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {
        this.swipeDirection = direction[0] < 0 ? 'next' : 'previous';
        if (this.searchString) {
          this.search();
        }
      }
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.setSize();
  }
  /**
   * Определяет размер выдаваемых результатов поиска и перезапрашивает данные
   */
  setSize(): void {
    /**
     * Сохраняю предыдущее количество элементов, чтобы не перерисовывать постоянно
     */
    const prevElementsAmount = this.elementsAmount;
    this.elementsAmount = Math.floor(window.innerWidth / 320);
    if (this.searchString && this.elementsAmount !== prevElementsAmount) this.search();
  }
  search(): void {
    if (!this.searchString) return;
    let pageToken;
    if (this.swipeDirection === 'next') {
      pageToken = this.nextPageToken;
    } else if (this.swipeDirection === 'previous') {
      pageToken = this.prevPageToken;
    }
    this.store.dispatch(YoutubeSearchRequestAction({ searchString: this.searchString, elementsAmount: this.elementsAmount, pageToken }))
  }

}
