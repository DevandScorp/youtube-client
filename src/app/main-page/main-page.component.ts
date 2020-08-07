import { Component, OnInit, HostListener } from '@angular/core';
import { YoutubeService } from '../shared/services/youtube.service';
import { YoutubeElement } from '../shared/interfaces';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  searchString: string;
  elementsAmount: number;
  youtubeElements: YoutubeElement[];
  screenWidth: number;
  showSearchHistory: boolean = false;
  swipeCoord: number[];

  constructor(private youtubeService: YoutubeService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.setSize();
  }
  editShowSearchHistory() {
    this.showSearchHistory = !this.showSearchHistory;
    console.log('here');
  }
  swipe(event: TouchEvent, when: string) {
    const coord: [number, number] = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      if (Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { const swipe = direction[0] < 0 ? 'next' : 'previous'; }
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = window.innerWidth;
    this.setSize();
  }
  /**
   * Определяет размер выдаваемых результатов поиска и перезапрашивает данные
   */
  setSize() {
    /**
     * Сохраняю предыдущее количество элементов, чтобы не перерисовывать постоянно
     */
    const prevElementsAmount = this.elementsAmount;
    this.elementsAmount = Math.floor(this.screenWidth / 320);
    console.log(this.elementsAmount, prevElementsAmount)
    if (this.searchString && this.elementsAmount !== prevElementsAmount) { this.search(); }

  }
  search() {
    this.alertService.success('success');
    this.youtubeService.searchVideoSnippet(this.searchString || '', this.elementsAmount)
      .subscribe(async response => {
        const youtubeVideoSnippets = response.items;
        const youtubeElements: YoutubeElement[] = [];
        for (const youtubeVideoSnippet of youtubeVideoSnippets) {
          const { items } = await this.youtubeService.getVideoStatistics(youtubeVideoSnippet.id.videoId).toPromise();
          const statistics = items[0]?.statistics;
          console.log(statistics);
          youtubeElements.push({
            name: youtubeVideoSnippet.snippet.title,
            creation_date: new Date(youtubeVideoSnippet.snippet.publishedAt),
            view_count: statistics ? +statistics.viewCount : 0,
            like_count: statistics ? +statistics.likeCount : 0,
            dislike_count: statistics ? +statistics.dislikeCount : 0,
            comment_count: statistics ? +statistics.commentCount : 0,
            image_url: youtubeVideoSnippet.snippet.thumbnails.high.url
          });
        }
        this.youtubeElements = youtubeElements;
        console.log(this.youtubeElements);
      });
  }

}
