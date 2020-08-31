import { AuthorizationService } from '../services/authorization.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private authorizationService: AuthorizationService,
              private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authorizationService.isAuthorized()) {
      this.authorizationService.logout();
      return this.router.navigate(['/login'], {
        queryParams: {
          isAuthorized: false
        }
      });
    }
    return true;
  }

}
