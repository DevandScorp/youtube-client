import { FilterHistoryPipe } from './shared/pipes/filterHistory.pipe';
import { AuthorizationInterceptor } from './shared/authorization.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Provider } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { MainPageComponent } from './main-page/main-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { YoutubePreviewComponent } from './youtube-preview/youtube-preview.component';
import { AlertComponent } from './shared/components/alert/alert.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: AuthorizationInterceptor
}
@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    MainPageComponent,
    YoutubePreviewComponent,
    AlertComponent,
    ErrorPageComponent,
    FilterHistoryPipe
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [INTERCEPTOR_PROVIDER],
  bootstrap: [AppComponent]
})
export class AppModule { }
