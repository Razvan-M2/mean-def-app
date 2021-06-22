import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RelationalKeyBundle } from '../models/RelationalKeyBundle';
import { RelationalKey } from '../models/RelationalKeys';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class KeywordsService {
  private data: RelationalKeyBundle = { number: 0, keys: [] };
  private keysUpdated = new Subject<RelationalKeyBundle>();

  constructor(private httpClient: HttpClient) {}

  getKeywords() {
    const endPoint = '/api/keys';
    this.httpClient
      .get<{ keys: RelationalKey[]; success: true; number: number }>(
        environment.apiUrl + endPoint
      )
      .pipe(
        map(
          (resData: {
            keys: RelationalKey[];
            success: true;
            number: number;
          }) => {
            return {
              keys: resData.keys,
              number: resData.number,
            };
          }
        )
      )
      .subscribe((transformedData: RelationalKeyBundle) => {
        this.data = transformedData;
        this.keysUpdated.next({
          keys: [...this.data.keys],
          number: transformedData.number,
        });
      });
  }

  getKeysUpdateListener() {
    return this.keysUpdated.asObservable();
  }

  postKeyword(data: RelationalKey): boolean {
    const endPoint = '/api/keys';
    this.httpClient
      .post<{ success: boolean }>(environment.apiUrl + endPoint, data)
      .subscribe((responseData) => {
        if (responseData.success) {
          this.getKeywords();
          return true;
        } else {
          return false;
        }
      });
    return false;
  }

  updateKeyword(data: RelationalKey, updatedData: string): boolean {
    const endPoint = '/api/keys/';
    this.httpClient
      .put<{ success: boolean }>(environment.apiUrl + endPoint + data.name, {
        data: updatedData,
      })
      .subscribe((responseData) => {
        if (responseData.success) {
          this.getKeywords();
          return true;
        } else {
          return false;
        }
      });
    return false;
  }

  deleteKeyword(keywordName: string): boolean {
    const endPoint = '/api/keys';
    this.httpClient
      .delete<{ success: boolean }>(
        environment.apiUrl + endPoint + '/' + keywordName
      )
      .subscribe((responseData) => {
        if (responseData.success) {
          this.getKeywords();
          return true;
        } else {
          return false;
        }
      });
    return false;
  }
}
