import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { AuthorizationService } from './services/authorization.service';
import { HistoryService } from './services/history.service';
import { YoutubeService } from './services/youtube.service';
import { AlertService } from './services/alert.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthorizationInterceptor } from './authorization.interceptor';
import { AuthorizationGuard } from './authorization.guard';

const INTERCEPTOR_PROVIDER: Provider = {
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: AuthorizationInterceptor
  }
@NgModule({
    imports: [],
    declarations: [],
    providers: []
  })
  export class CoreModule {
    static forRoot(): ModuleWithProviders<CoreModule> {
      return {
        ngModule: CoreModule,
        providers: [
          AuthorizationService,
          HistoryService,
          YoutubeService,
          AlertService,
          INTERCEPTOR_PROVIDER,
          AuthorizationGuard
        ]
      };
    }
  }