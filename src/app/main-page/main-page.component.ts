import { Component, OnInit } from '@angular/core';
import { YoutubeService } from '../shared/services/youtube.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  searchString: string;

  constructor(private youtubeService: YoutubeService) { }

  ngOnInit(): void {
  }
  search() {
    this.youtubeService.searchVideoSnippet(this.searchString)
      .subscribe(info => {
        console.log(info);
      })
  }

}
