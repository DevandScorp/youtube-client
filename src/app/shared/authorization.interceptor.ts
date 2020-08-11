import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import { AuthorizationService } from './services/authorization.service';
import { AlertService } from './services/alert.service';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(
    private authorizationService: AuthorizationService,
    private alertService: AlertService,
    private router: Router
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authorizationService.isAuthorized()) {
      req = req.clone({
        setParams: {
          auth: this.authorizationService.token
        }
      });
    }
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('[Interceptor Error]: ', error);
          if (error.status === 401) {
            this.authorizationService.logout();
            this.router.navigate(['/login'], {
              queryParams: {
                isAuthorized: false
              }
            });
          }
          if (error.message) { this.alertService.error(error.message); }
          return throwError(error);
        })
      );
  }
}
