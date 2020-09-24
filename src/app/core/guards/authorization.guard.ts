import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppState } from 'src/app/store';
import { Store } from '@ngrx/store';
import { selectToken } from 'src/app/store/selectors/authorization.selector';
import { take, mergeMap } from 'rxjs/operators';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private store: Store<AppState>,
    private router: Router) { }
    
  canActivate(): boolean | Observable<boolean> | Promise<boolean> | boolean {
    return this.store.select(selectToken).pipe(
      take(1),
      mergeMap(response => {
        if (!response) {
          localStorage.clear();
          return this.router.navigateByUrl('/login', {
            queryParams: {
              isAuthorized: false
            }
          });
        }
        return of(true);
      }));
  }
}
