import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunityUrls, ConfigUrls, ServiceUrls } from '../utils/urls.const';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  fetchInvoiceList:EventEmitter<any> = new EventEmitter();
  constructor(private http: HttpClient) {}

  public createCommunityService(payload:any): Observable<any> {
    return this.http.post(CommunityUrls.CREATE,payload);
  }
  public updateCommunityService(payload:any): Observable<any> {
    return this.http.post(CommunityUrls.UPDATE,payload);
  }
  public getCommunityById(id:number): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.get(CommunityUrls.GET_BY_ID, { params: params });
  }


  public getAllCommunity(): Observable<any> {
    return this.http.get(CommunityUrls.GETALL_BY_DISTANCE_ORDER);
  }
  public getAllCommunityDropdownList(): Observable<any> {
    return this.http.get(CommunityUrls.GETALL);
  }

  public getAllService(): Observable<any> {
      return this.http.get(ServiceUrls.GETALL);
    }

  public getAllConfigByName(queryParams: Map<string, any>): Observable<any> {
    let params = new HttpParams();
    params = params.append('configNames',queryParams.get('configNames'));
    return this.http.get(ConfigUrls.GET_ALL_BY_NAME,{params:params});
  }

  public getAllTnxHistoryByCommunityId(id:number): Observable<any> {
    let params = new HttpParams();
    params = params.append('id',id);
    return this.http.get(CommunityUrls.GETALL_TNX_HISTORY,{params:params});
  }
  
}
