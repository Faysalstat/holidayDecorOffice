import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DecorationItemsUrls } from '../utils/urls.const';

@Injectable({
  providedIn: 'root',
})
export class DecorationItemService {

  constructor(private http: HttpClient) {}

  public createDecorationItem(payload: any): Observable<any> {
    return this.http.post(DecorationItemsUrls.CREATE, payload);
  }
  public updateDecorationItem(payload: any): Observable<any> {
    return this.http.post(DecorationItemsUrls.UPDATE, payload);
  }
  public getDecorationItemById(id: number): Observable<any> {
    return this.http.get(DecorationItemsUrls.GET_BY_ID + id);
  }
  public getAllDecorationItem(): Observable<any> {
    return this.http.get(DecorationItemsUrls.GET_ALL);
  }
  public deleteDecorationItem(id: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.delete(DecorationItemsUrls.DELETE, { params: params });
  }
}
