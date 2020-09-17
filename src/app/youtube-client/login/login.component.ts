import { AlertService } from '../../core/services/alert.service';
import { AuthorizationService } from '../../core/services/authorization.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  preloader = false;

  constructor(private authorizationService: AuthorizationService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]]
    })
    this.route.queryParams.subscribe((params: Params) => {
      if (params.isAuthorized === 'false') {
        this.alertService.error('You are not authorized');
      }
    });
  }
  private _handleError(error: HttpErrorResponse): Observable<any> {
    this.preloader = false;
    return throwError(error);
  }
  submit(): void {
    this.preloader = true;
    this.authorizationService.login({
      email: this.form.value.email,
      password: this.form.value.password
    })
      .pipe(catchError(this._handleError.bind(this)))
      .subscribe(() => {
        this.alertService.success('Вы успешно вошли в систему');
        this.form.reset();
        this.router.navigateByUrl('/');
      });
  }
}
