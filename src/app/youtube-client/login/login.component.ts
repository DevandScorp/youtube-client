import { AlertService } from '../../core/services/alert.service';
import { AuthorizationService } from '../../core/services/authorization.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { LogInRequestAction } from 'src/app/store/actions/authorization.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loginPreloader$ = this.store.select(state => state.authorization.loginPreloader);

  constructor(private store: Store<AppState>,
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
  submit(): void {
    this.store.dispatch(LogInRequestAction({
      email: this.form.value.email,
      password: this.form.value.password
    }))
  }
}
