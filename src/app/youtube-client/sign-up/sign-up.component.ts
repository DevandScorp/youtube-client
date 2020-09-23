import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { AppState } from 'src/app/store';
import { Store } from '@ngrx/store';
import { SignUpRequestAction } from 'src/app/store/actions/authorization.actions';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  form: FormGroup;
  signUpPreloader$ = this.store.select(state => state.authorization.signUpPreloader);

  constructor(private store: Store<AppState>,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  submit(): void {
    this.store.dispatch(SignUpRequestAction({
      email: this.form.value.email,
      password: this.form.value.password
    }));
  }
}
