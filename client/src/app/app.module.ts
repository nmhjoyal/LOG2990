import { NgModule, Type } from '@angular/core';
import { AppComponent } from './components/app/app.component';
import { NewDrawingWindowComponent } from './drawing-view/components/modal-windows/new-drawing-window/new-drawing-window.component';
import { WelcomeWindowComponent } from './drawing-view/components/modal-windows/welcome-window/welcome-window.component';
import { ModalWindowComponent } from './drawing-view/components/modal-windows/modal-window/modal-window.component';
import { SaveWindowComponent } from './drawing-view/components/modal-windows/save-window/save-window.component';
import { GalleryWindowComponent } from './drawing-view/components/modal-windows/gallery-window/gallery-window/gallery-window.component';
import { DrawingViewModule } from './drawing-view/drawing-view.module';
import { MatListModule, MatToolbarModule, MatCheckboxModule, MatSidenavModule, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from './services/local_storage/local-storage-service';
import { CanvasInformationService } from './services/canvas-information/canvas-information.service';
import { ToolHandlerService } from './services/tool-handler/tool-handler.service';


@NgModule({
  declarations: [
    AppComponent,
    NewDrawingWindowComponent,
    WelcomeWindowComponent,
    ModalWindowComponent as Type<ModalWindowComponent>,
    SaveWindowComponent,
    GalleryWindowComponent,
    WelcomeWindowComponent,
    NewDrawingWindowComponent,
  ],
  imports: [
    DrawingViewModule,
    MatListModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSidenavModule,
    FormsModule,
    DrawingViewModule,
  ],
  providers: [ MatDialogConfig, LocalStorageService, ToolHandlerService, CanvasInformationService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }, ],
  bootstrap: [AppComponent],
  entryComponents: [ModalWindowComponent as Type<ModalWindowComponent>, WelcomeWindowComponent,
    NewDrawingWindowComponent, SaveWindowComponent, GalleryWindowComponent],
})
export class AppModule {
}
