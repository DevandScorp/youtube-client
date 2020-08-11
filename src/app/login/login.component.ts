import { AlertService } from './../shared/services/alert.service';
import { AuthorizationService } from './../shared/services/authorization.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../shared/interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  preloader = false;

  constructor(private authorizationService: AuthorizationService,
              private router: Router,
              private route: ActivatedRoute,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });
    this.route.queryParams.subscribe((params: Params) => {
      if (params.isAuthorized === 'false') {
        this.alertService.error('You are not authorized');
      }
    });
  }
  private handleError(error: HttpErrorResponse): Observable<any> {
    this.preloader = false;
    return throwError(error);
  }
  submit(): void {
    if (this.form.invalid) { return; }
    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    };
    this.preloader = true;
    this.authorizationService.login(user)
      .pipe(catchError(this.handleError.bind(this)))
      .subscribe(() => {
        this.alertService.success('Вы успешно вошли в систему');
        this.form.reset();
        this.router.navigate(['/']);
      });
  }
}
