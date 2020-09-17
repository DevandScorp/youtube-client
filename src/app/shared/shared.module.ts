import { AlertComponent } from './components/alert/alert.component';
import { NgModule } from '@angular/core';
import { FilterHistoryPipe } from './pipes/filterHistory.pipe';
import { CommonModule } from '@angular/common';
import { ValidationDirective } from './directives/validation.directive';
import { YoutubePreviewComponent } from './components/youtube-preview/youtube-preview.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AlertComponent,
        FilterHistoryPipe,
        ValidationDirective,
        YoutubePreviewComponent
    ],
    declarations: [
        AlertComponent,
        FilterHistoryPipe,
        ValidationDirective,
        YoutubePreviewComponent
    ]
})
export class SharedModule { }