import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigUrls } from '../utils/urls.const';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(private http: HttpClient) {}
  public getAllConfig(): Observable<any> {
    return this.http.get(ConfigUrls.GET_ALL);
  }

  public updateConfig(payload: any): Observable<any> {
    return this.http.post(ConfigUrls.UPDATE, payload);
  }
}
