import { Component, OnInit, HostListener } from '@angular/core';
import { YoutubeService } from '../shared/services/youtube.service';
import { YoutubeElement } from '../shared/interfaces';

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
  constructor(private youtubeService: YoutubeService) { }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.setSize();
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
    if (this.screenWidth > 1630) { this.elementsAmount = 5; }
    if (this.screenWidth < 1630 && this.screenWidth > 1230) { this.elementsAmount = 4; }
    if (this.screenWidth < 1230 && this.screenWidth > 890) { this.elementsAmount = 2; }
    if (this.screenWidth < 890) { this.elementsAmount = 1; }
    console.log(this.elementsAmount, prevElementsAmount)
    if (this.searchString && this.elementsAmount !== prevElementsAmount) { this.search(); }

  }
  search() {
    this.youtubeService.searchVideoSnippet(this.searchString, this.elementsAmount)
      .subscribe(async response => {
        const youtubeVideoSnippets = response.items;
        const youtubeElements: YoutubeElement[] = [];
        for (const youtubeVideoSnippet of youtubeVideoSnippets) {
          const { items } = await this.youtubeService.getVideoStatistics(youtubeVideoSnippet.id.videoId).toPromise();
          const statistics = items[0].statistics;
          youtubeElements.push({
            name: youtubeVideoSnippet.snippet.title,
            description: youtubeVideoSnippet.snippet.description,
            creation_date: new Date(youtubeVideoSnippet.snippet.publishedAt),
            view_count: +statistics.viewCount,
            like_count: +statistics.likeCount,
            dislike_count: +statistics.dislikeCount,
            comment_count: +statistics.commentCount,
            image_url: youtubeVideoSnippet.snippet.thumbnails.high.url
          });
        }
        this.youtubeElements = youtubeElements;
        console.log(this.youtubeElements);
      });
  }

}
