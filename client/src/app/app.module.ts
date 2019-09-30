import { HttpClientModule } from '@angular/common/http';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatListModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './components/app/app.component';
import { LocalStorageService } from './services/local_storage/LocalStorageService';
import { ModalWindowComponent } from './drawing-view/components/modal-window/modal-window.component';
import { DrawingViewModule } from './drawing-view/drawing-view.module'
import { WelcomeWindowComponent } from './drawing-view/components/welcome-window/welcome-window.component';
import { NewDrawingWindowComponent } from './drawing-view/components/new-drawing-window/new-drawing-window.component';


@NgModule({
  declarations: [
    AppComponent,
    ModalWindowComponent as Type<ModalWindowComponent>,
    WelcomeWindowComponent,
    NewDrawingWindowComponent,

  ],
  imports: [
    BrowserModule,
    DrawingViewModule,
    HttpClientModule,
    MatListModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSidenavModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
  ],
  providers: [ MatDialogConfig, LocalStorageService,
    { provide: MatDialogRef, useValue: {} },
  { provide: MAT_DIALOG_DATA, useValue: [] }, ],
  bootstrap: [AppComponent],
  entryComponents: [ModalWindowComponent as Type<ModalWindowComponent>, WelcomeWindowComponent, NewDrawingWindowComponent],
})
export class AppModule {
}
