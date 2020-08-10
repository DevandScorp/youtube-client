import { AlertService } from './../shared/services/alert.service';
import { AuthorizationService } from './../shared/services/authorization.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../shared/interfaces';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  form: FormGroup;
  preloader = false;

  constructor(private authorizationService: AuthorizationService,
    private alertService: AlertService,
    private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
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
    this.authorizationService.signUp(user)
      .pipe(catchError(this.handleError.bind(this)))
      .subscribe(() => {
        this.alertService.success('Вы успешно зарегистрировались в системе');
        this.form.reset();
        this.router.navigate(['/login']);
      });
  }
}
