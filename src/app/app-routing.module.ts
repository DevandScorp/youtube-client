import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';

@NgModule({
  imports: [RouterModule.forRoot(
    [{ path: '', loadChildren: () => import('./youtube-client/youtube-client.module').then(module => module.YoutubeClientModule) }]
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }