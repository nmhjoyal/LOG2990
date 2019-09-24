import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatListModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { MatDialogConfig, MatDialogModule} from '@angular/material/dialog';
import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './components/app/app.component';
import { ModalWindowComponent } from './drawing-view/components/modal-window/modal-window.component';
import { WelcomeWindowComponent } from './drawing-view/components/welcome-window/welcome-window.component';
import { LocalStorageService } from './services/local_storage/LocalStorageService';
import { RouterModule, Routes } from '@angular/router';
import {DrawViewComponent} from './drawing-view/draw-view/draw-view.component';
import { LateralBarComponent } from './drawing-view/components/lateral-bar/lateral-bar.component';
import {TitleBarComponent} from './drawing-view/components/title-bar/title-bar.component';


const appRoutes: Routes = [
  {path: '', component: DrawViewComponent },
]


@NgModule({
  declarations: [
    AppComponent,
    ModalWindowComponent,
    WelcomeWindowComponent,
    DrawViewComponent,
    LateralBarComponent,
    TitleBarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatListModule,
    MatToolbarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true} // debugging purposes?
    )
  ],
  providers: [ MatDialogConfig, LocalStorageService],
  bootstrap: [AppComponent],
  entryComponents: [ModalWindowComponent, WelcomeWindowComponent],
})
export class AppModule {
}
