import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule, MatListModule, MatMenuModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AppComponent } from './components/app/app.component';
import { ColorPaletteComponent } from './drawing-view/components/color-picker/color-palette/color-palette.component';
import { ColorPickerComponent } from './drawing-view/components/color-picker/color-picker.component';
import { ModalWindowComponent } from './drawing-view/components/modal-window/modal-window.component';
import { NewDrawingWindowComponent } from './drawing-view/components/new-drawing-window/new-drawing-window.component';
import { WelcomeWindowComponent } from './drawing-view/components/welcome-window/welcome-window.component';
import { DrawingViewModule } from './drawing-view/drawing-view.module';
import { ColorService } from './services/color_service/color.service';
import { GridService } from './services/grid_service/grid.service';
import { LocalStorageService } from './services/local_storage/local-storage-service';
import { ToolHandlerService } from './services/tool-handler/tool-handler.service';

@NgModule({
  declarations: [
    AppComponent,
    NewDrawingWindowComponent,
    WelcomeWindowComponent,
    ModalWindowComponent as Type<ModalWindowComponent>,
    WelcomeWindowComponent,
    NewDrawingWindowComponent,
    ColorPickerComponent,
    ColorPaletteComponent,

  ],
  imports: [
    DrawingViewModule,
    MatListModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatMenuModule,
    FormsModule,
  ],
  providers: [ MatDialogConfig, LocalStorageService, ToolHandlerService, ColorService, GridService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }, ],
  bootstrap: [AppComponent],
  entryComponents: [ModalWindowComponent as Type<ModalWindowComponent>,
    WelcomeWindowComponent, NewDrawingWindowComponent, ColorPickerComponent],
})
export class AppModule { }
