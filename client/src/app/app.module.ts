import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA, MatButtonModule, MatButtonToggleModule, MatCheckboxModule, MatDialogConfig, MatDialogRef, MatIconModule,
  MatListModule, MatMenuModule, MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatToolbarModule
} from '@angular/material';
import { AppComponent } from './components/app/app.component';
import { ColourPaletteComponent } from './drawing-view/components/modal-windows/colour-window/colour-palette/colour-palette.component';
import { ColourPickerComponent } from './drawing-view/components/modal-windows/colour-window/colour-picker/colour-picker.component';
import { ExportWindowComponent } from './drawing-view/components/modal-windows/export-window/export-window.component';
import { GalleryWindowComponent } from './drawing-view/components/modal-windows/gallery-window/gallery-window/gallery-window.component';
import { ModalWindowComponent } from './drawing-view/components/modal-windows/modal-window/modal-window.component';
import { NewDrawingWindowComponent } from './drawing-view/components/modal-windows/new-drawing-window/new-drawing-window.component';
import { SaveWindowComponent } from './drawing-view/components/modal-windows/save-window/save-window.component';
import { WelcomeWindowComponent } from './drawing-view/components/modal-windows/welcome-window/welcome-window.component';
import { DrawingViewModule } from './drawing-view/drawing-view.module';
import { CanvasInformationService } from './services/canvas-information/canvas-information.service';
import { ColourService } from './services/colour_service/colour.service';
import { ExportInformationService } from './services/export-information/export-information.service';
import { FilterTagsPipe } from './services/filter-pipe/filter-tags.pipe';
import { LocalStorageService } from './services/local_storage/local-storage-service';
import { ToolHandlerService } from './services/tool-handler/tool-handler.service';

@NgModule({
  declarations: [
    AppComponent,
    NewDrawingWindowComponent,
    WelcomeWindowComponent,
    ModalWindowComponent as Type<ModalWindowComponent>,
    SaveWindowComponent,
    ExportWindowComponent,
    GalleryWindowComponent,
    WelcomeWindowComponent,
    NewDrawingWindowComponent,
    ColourPickerComponent,
    ColourPaletteComponent,
    FilterTagsPipe,
  ],
  imports: [
    DrawingViewModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSidenavModule,
    MatMenuModule,
    FormsModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
  ],
  providers: [MatDialogConfig, LocalStorageService, ToolHandlerService, CanvasInformationService, ColourService, ExportInformationService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }, ],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalWindowComponent as Type<ModalWindowComponent>,
    WelcomeWindowComponent,
    ColourPickerComponent,
    NewDrawingWindowComponent,
    SaveWindowComponent,
    GalleryWindowComponent,
    ExportWindowComponent,
  ],
})
export class AppModule { }
