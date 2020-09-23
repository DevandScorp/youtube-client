import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, take } from 'rxjs/operators';
import { AuthorizationService } from '../services/authorization.service';
import { AlertService } from '../services/alert.service';
import { AppState } from 'src/app/store';
import { Store } from '@ngrx/store';
import { selectToken } from 'src/app/store/selectors/authorization.selector';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(
    private authorizationService: AuthorizationService,
    private alertService: AlertService,
    private router: Router,
    private store: Store<AppState>
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select(selectToken).pipe(
      take(1),
      mergeMap(response => {
        if (!!response) {
          req = req.clone({
            setParams: {
              auth: response
            }
          });
        }
        return next.handle(req);
      }),
      catchError((error: HttpErrorResponse) => {
        this.alertService.error('error');
        console.log('[Interceptor Error]: ', error);
        if (error.status === 401) {
          localStorage.clear();
          this.router.navigateByUrl('/login', {
            queryParams: {
              isAuthorized: false
            }
          });
        }
        if (error.message) this.alertService.error(error.message);
        return throwError(error);
      })
    )
  }
}
