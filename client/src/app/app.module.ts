import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatDialogConfig, MatDialogModule} from '@angular/material/dialog';
import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import {AppComponent} from './components/app/app.component';
import { ModalWindowComponent } from './drawing-view/components/modal-window/modal-window.component';
import { WelcomeWindowComponent } from './drawing-view/components/welcome-window/welcome-window.component';
@NgModule({
  declarations: [
    AppComponent,
    ModalWindowComponent,
    WelcomeWindowComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [CookieService, MatDialogConfig],
  bootstrap: [AppComponent],
  entryComponents: [ModalWindowComponent, WelcomeWindowComponent],
})
export class AppModule {
}
