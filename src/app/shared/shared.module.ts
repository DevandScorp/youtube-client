import { AlertComponent } from './components/alert/alert.component';
import { NgModule } from '@angular/core';
import { FilterHistoryPipe } from './pipes/filterHistory.pipe';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { CommonModule } from '@angular/common';
import { ValidationDirective } from './directives/validation.directive';
import { YoutubePreviewComponent } from './components/youtube-preview/youtube-preview.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        AlertComponent,
        FilterHistoryPipe,
        ErrorPageComponent,
        ValidationDirective,
        YoutubePreviewComponent
    ],
    declarations: [
        AlertComponent,
        FilterHistoryPipe,
        ErrorPageComponent,
        ValidationDirective,
        YoutubePreviewComponent
    ]
  })
  export class SharedModule{}