import { Component, OnInit, Input } from '@angular/core';
import { YoutubeElement } from '../../../interfaces';

@Component({
  selector: 'app-youtube-preview',
  templateUrl: './youtube-preview.component.html',
  styleUrls: ['./youtube-preview.component.scss']
})
export class YoutubePreviewComponent implements OnInit {

  iconsContainerInfo: { icon: string, countName: string }[] = [
    { icon: '/assets/view.svg', countName: 'view_count'},
    { icon: '/assets/like.svg', countName: 'like_count'},
    { icon: '/assets/dislike.svg', countName: 'dislike_count'},
    { icon: '/assets/comment.svg', countName: 'comment_count'}
  ];

  constructor() { }

  @Input() youtubeElement: YoutubeElement;

  ngOnInit(): void {
  }

}
