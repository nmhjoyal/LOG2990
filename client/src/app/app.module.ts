import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA, MatCheckboxModule, MatDialogConfig,
  MatDialogRef, MatListModule, MatSidenavModule, MatToolbarModule, MatButtonToggleModule
} from '@angular/material';
import { AppComponent } from './components/app/app.component';
import { ColorPaletteComponent } from './drawing-view/components/color-picker/color-palette/color-palette.component';
import { ColorPickerComponent } from './drawing-view/components/color-picker/color-picker.component';
import { GalleryWindowComponent } from './drawing-view/components/modal-windows/gallery-window/gallery-window/gallery-window.component';
import { ModalWindowComponent } from './drawing-view/components/modal-windows/modal-window/modal-window.component';
import { NewDrawingWindowComponent } from './drawing-view/components/modal-windows/new-drawing-window/new-drawing-window.component';
import { SaveWindowComponent } from './drawing-view/components/modal-windows/save-window/save-window.component';
import { WelcomeWindowComponent } from './drawing-view/components/modal-windows/welcome-window/welcome-window.component';
import { DrawingViewModule } from './drawing-view/drawing-view.module';
import { CanvasInformationService } from './services/canvas-information/canvas-information.service';
import { ColorService } from './services/color_service/color.service';
import { LocalStorageService } from './services/local_storage/local-storage-service';
import { ToolHandlerService } from './services/tool-handler/tool-handler.service';
import { FilterTagsPipe } from './services/filter-tags.pipe';

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
    ColorPickerComponent,
    ColorPaletteComponent,
    FilterTagsPipe,
  ],
  imports: [
    DrawingViewModule,
    MatListModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSidenavModule,
    FormsModule,
    MatButtonToggleModule,

  ],
  providers: [MatDialogConfig, LocalStorageService, ToolHandlerService, CanvasInformationService, ColorService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }, ],
  bootstrap: [AppComponent],
  entryComponents: [ModalWindowComponent as Type<ModalWindowComponent>, WelcomeWindowComponent, ColorPickerComponent,
    NewDrawingWindowComponent, SaveWindowComponent, GalleryWindowComponent],
})
export class AppModule { }
