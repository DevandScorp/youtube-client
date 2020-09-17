import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MainPageComponent } from './main-page/main-page.component';
import { AuthorizationGuard } from '../core/guards/authorization.guard';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ErrorPageComponent } from './error-page/error-page.component';

@NgModule({
    declarations: [
        LoginComponent,
        MainPageComponent,
        SignUpComponent,
        ErrorPageComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild([
            { path: '', component: MainPageComponent, canActivate: [AuthorizationGuard]},
            { path: 'login', component: LoginComponent },
            { path: 'signup', component: SignUpComponent },
            { path: 'error', component: ErrorPageComponent},
            { path: '**', redirectTo: '/error' },
        ])
    ],
    exports: [RouterModule]
})
export class YoutubeClientModule { }