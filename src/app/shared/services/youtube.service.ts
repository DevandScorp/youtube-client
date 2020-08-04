import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class YoutubeService {
  constructor(private http: HttpClient) {}

  searchVideoSnippet(searchString: string) {
    return this.http.get<any>('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: environment.youtubeAPIKey,
        part: 'snippet',
        q: searchString
      }
    })

  }
  getVideoStatistics(videoId: string) {
    return this.http.get<any>('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        key: environment.youtubeAPIKey,
        part: 'statistics',
        id: videoId
      }
    })
  }
}
