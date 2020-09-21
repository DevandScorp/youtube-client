import { AuthorizationService } from '../../core/services/authorization.service';
import { HistoryService } from '../../core/services/history.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { YoutubeService } from '../../core/services/youtube.service';
import { YoutubeElement, HistoryElement } from '../../interfaces';
import { AlertService } from '../../core/services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  searchString: string;
  elementsAmount: number;
  youtubeElements: YoutubeElement[];
  screenWidth: number;
  showSearchHistory = false;
  preloader = false;
  swipeCoord: number[];
  swipeDirection: string;
  nextPageToken: string;
  prevPageToken: string;
  historyElements: HistoryElement[];
  historyPreloader = false;

  constructor(private youtubeService: YoutubeService,
    private alertService: AlertService,
    private authorizationService: AuthorizationService,
    private router: Router,
    private historyService: HistoryService) { }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.setSize();
    this.historyPreloader = true;
    this.historyService.getHistoryElements()
      .pipe(catchError(this._handleHisotryError.bind(this)))
      .subscribe(result => {
        this.historyElements = this.authorizationService.getLocalId() ? result.filter(element => element.localId === this.authorizationService.getLocalId()) : result;
        this.historyPreloader = false;
        console.log(result);
      });
  }
  logout() {
    this.authorizationService.logout();
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
    this.screenWidth = window.innerWidth;
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
    this.elementsAmount = Math.floor(this.screenWidth / 320);
    if (this.searchString && this.elementsAmount !== prevElementsAmount) { this.search(); }

  }
  private _handleHisotryError(error: HttpErrorResponse): Observable<any> {
    if (error.message) { this.alertService.error(error.message); }
    console.log(error);
    this.historyPreloader = false;
    return throwError(error);
  }
  private _handleYoutubeError(error: HttpErrorResponse): Observable<any> {
    if (error.message) { this.alertService.error(error.message); }
    console.log(error);
    this.preloader = false;
    return throwError(error);
  }
  search(): void {
    if (!this.searchString) { return; }
    let pageToken;
    if (this.swipeDirection === 'next') {
      pageToken = this.nextPageToken;
    } else if (this.swipeDirection === 'previous') {
      pageToken = this.prevPageToken;
    }
    this.preloader = true;
    this.youtubeService.searchVideoSnippet(this.searchString, this.elementsAmount, pageToken)
      .pipe(
        mergeMap(response => {
          this.nextPageToken = response.nextPageToken || '';
          this.prevPageToken = response.prevPageToken || '';
          const youtubeVideoSnippets = response.items;
          return forkJoin(youtubeVideoSnippets.map(youtubeVideoSnippet => this.youtubeService.getVideoStatistics(youtubeVideoSnippet.id.videoId))).pipe(
            map((snippets: any[]) => {
              const youtubeResultingArray = [];
              for(let i = 0; i < snippets.length; ++i) {
                const statistics = snippets[i].items[0]?.statistics;
                youtubeResultingArray.push({
                  name: youtubeVideoSnippets[i].snippet.title,
                  creation_date: new Date(youtubeVideoSnippets[i].snippet.publishedAt),
                  view_count: statistics ? +statistics.viewCount || 0 : 0,
                  like_count: statistics ? +statistics.likeCount || 0 : 0,
                  dislike_count: statistics ? +statistics.dislikeCount || 0 : 0,
                  comment_count: statistics ? +statistics.commentCount || 0 : 0,
                  image_url: youtubeVideoSnippets[i].snippet.thumbnails.high.url || '/assets/not-found.svg'
                })
              }
              return youtubeResultingArray;
            })
          )
        }),
        catchError(this._handleYoutubeError.bind(this))
      )
      .subscribe(response => {
        this.youtubeElements = response;
        this.preloader = false;
        if (!this.swipeDirection) {
          const historyElement: HistoryElement = { query: this.searchString, localId: this.authorizationService.getLocalId() };
          this.historyService.createHistoryElement(historyElement).subscribe((result) => {
            if (!this.historyElements.length) { this.historyElements = []; }
            this.historyElements.push({ query: this.searchString, localId: this.authorizationService.getLocalId() });
          });
        }
        this.swipeDirection = '';
      });
  }

}
