import { Component, OnInit, Input } from '@angular/core';
import { YoutubeElement } from '../../../interfaces';

@Component({
  selector: 'app-youtube-preview',
  templateUrl: './youtube-preview.component.html',
  styleUrls: ['./youtube-preview.component.css']
})
export class YoutubePreviewComponent implements OnInit {

  constructor() { }

  @Input() youtubeElement: YoutubeElement;

  ngOnInit(): void {
  }

}
