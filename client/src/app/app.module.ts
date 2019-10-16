import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule, MatListModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AppComponent } from './components/app/app.component';
import { CanvasComponent } from './drawing-view/components/canvas/canvas.component';
import { ModalWindowComponent } from './drawing-view/components/modal-window/modal-window.component';
import { NewDrawingWindowComponent } from './drawing-view/components/new-drawing-window/new-drawing-window.component';
import { WelcomeWindowComponent } from './drawing-view/components/welcome-window/welcome-window.component';
import { DrawingViewModule } from './drawing-view/drawing-view.module';
import { LocalStorageService } from './services/local_storage/local-storage-service';

@NgModule({
  declarations: [
    AppComponent,
    NewDrawingWindowComponent,
    CanvasComponent,
    WelcomeWindowComponent,
    ModalWindowComponent as Type<ModalWindowComponent>,
  ],
  imports: [
    MatListModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSidenavModule,
    FormsModule,
    DrawingViewModule,
  ],
  providers: [ MatDialogConfig, LocalStorageService,
    { provide: MatDialogRef, useValue: {} },
  { provide: MAT_DIALOG_DATA, useValue: [] }, ],
  bootstrap: [AppComponent],
  entryComponents: [ModalWindowComponent as Type<ModalWindowComponent>, WelcomeWindowComponent, NewDrawingWindowComponent],
})
export class AppModule {
}
