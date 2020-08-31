import { AlertComponent } from './components/alert/alert.component';
import { NgModule } from '@angular/core';
import { FilterHistoryPipe } from './pipes/filterHistory.pipe';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        AlertComponent,
        FilterHistoryPipe,
        ErrorPageComponent
    ],
    declarations: [
        AlertComponent,
        FilterHistoryPipe,
        ErrorPageComponent
    ]
  })
  export class SharedModule{}