import {inject, Injectable} from '@angular/core';
import {HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {CacheService} from './cache.service';
import {tap} from 'rxjs/operators';

// i added context token than we can specify which methods should not be cached by passing correct context value
// by default every GET method will be cached
export const CACHEABLE = new HttpContextToken(() => true);

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

    private cacheService: CacheService = inject(CacheService);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (req.method !== 'GET' || !req.context.get(CACHEABLE)) {
            // in the future we can clear cache for some post/put methods
            return next.handle(req);
        }

        const cachedResponse: HttpResponse<any> = this.cacheService.get(req.url);

        if (cachedResponse) {
            return of(cachedResponse);
        }

        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    this.cacheService.set(req.url, event)
                }
            })
        )
    }

}
