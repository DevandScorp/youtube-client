import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class YoutubeService {
  constructor(private http: HttpClient) {}

  /**
   * Поиск сниппетов видео
   * @param searchString - поисковая строка
   * @param elementsAmount - количество элементов для поиска
   */
  searchVideoSnippet(searchString: string, elementsAmount: number, pageToken?: string): Observable<any> {
    return this.http.get<any>('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: environment.youtubeAPIKey,
        part: 'snippet',
        q: searchString,
        maxResults: elementsAmount + '',
        pageToken: pageToken || ''
      }
    });
  }
  /**
   * Получение статистики видео
   * @param videoId - идентификатор видео
   */
  getVideoStatistics(videoId: string): Observable<any> {
    return this.http.get<any>('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        key: environment.youtubeAPIKey,
        part: 'statistics',
        id: videoId
      }
    });
  }
}
