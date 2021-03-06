import { HistoryElement } from '../../store/models/history.models';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HistoryService {
  constructor(private http: HttpClient) { }

  createHistoryElement(historyElement: HistoryElement): Observable<any> {
    return this.http.post(`${environment.firebaseDatabaseUrl}/history.json`, historyElement);
  }
  
  getHistoryElements(): Observable<HistoryElement[]> {
    return this.http.get<HistoryElement[]>(`${environment.firebaseDatabaseUrl}/history.json`)
      .pipe(map((response: any) => response ? Object.keys(response).map(key => response[key]) : []));
  }
}
