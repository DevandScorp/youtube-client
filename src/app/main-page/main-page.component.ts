import { Component, OnInit } from '@angular/core';
import { YoutubeService } from '../shared/services/youtube.service';
import { YoutubeElement } from '../shared/interfaces';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  searchString: string;
  youtubeElements: YoutubeElement[]
  constructor(private youtubeService: YoutubeService) {}

  ngOnInit(): void {
  }
  search() {
    this.youtubeService.searchVideoSnippet(this.searchString)
      .subscribe(async response=> {
        const youtubeVideoSnippets = response.items;
        const youtubeElements: YoutubeElement[] = [];
        for(const youtubeVideoSnippet of youtubeVideoSnippets) {
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
          })
        }
        this.youtubeElements = youtubeElements;
        console.log(this.youtubeElements);
      })
  }

}
