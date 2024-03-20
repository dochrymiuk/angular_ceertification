import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpResponse} from '@angular/common/http';

type URL = string;
interface CachedData {
  data: HttpResponse<any>;
  expirationDate: Date;
}
interface Cache {
 [key: URL]: CachedData;
}

export const CACHE_KEY : string = "cachedResponses";

@Injectable()
export class CacheService {

  private readonly cache: Cache = {};

  constructor() {
    const cache = localStorage.getItem(CACHE_KEY);
    if (cache) {
      this.cache = this.parseJsonToCacheObject(JSON.parse(cache));
    }
  }

  set(key: URL, data: HttpResponse<any>): void {
    this.cache[key] = { data, expirationDate: new Date(new Date().getTime() + environment.cacheDuration) };
    this.updateCacheInStorage();
  }

  get(key: URL): HttpResponse<any> {
    const cachedData = this.cache[key];
    if (cachedData) {
      if (this.validateExpirationDate(cachedData)) {
        return cachedData.data;
      } else {
        this.clear(key);
      }
    }
    return null;
  }

  clear(key: string): void {
    delete this.cache[key];
    this.updateCacheInStorage();
  }

  private validateExpirationDate(data: CachedData): boolean {
    return new Date(data.expirationDate) > new Date();
  }

  private updateCacheInStorage() {
    localStorage.setItem(CACHE_KEY, JSON.stringify(this.cache));
  }

  private parseJsonToCacheObject(json: Cache): Cache {
    const cache: Cache = {};
    Object.keys(json).forEach(url => {
      const value: CachedData = json[url];
      cache[url] = { data: this.parseJsonObjectToHttpResponse(value.data), expirationDate: value.expirationDate } as CachedData;
    });
    return cache;
  }

  private parseJsonObjectToHttpResponse(object: HttpResponse<any>) {
    return new HttpResponse({ ...object });
  }

}
