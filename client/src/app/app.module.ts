import { HttpClientModule } from '@angular/common/http';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatListModule, MatSidenavModule,
  MatToolbarModule } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './components/app/app.component';
import { MockCanvasComponent } from './drawing-view/components/mock-canvas/mock-canvas.component';
import { ModalWindowComponent } from './drawing-view/components/modal-window/modal-window.component';
import { NewDrawingWindowComponent } from './drawing-view/components/new-drawing-window/new-drawing-window.component';
import { RectangleComponent } from './drawing-view/components/tools/shapes/rectangle/rectangle.component';
import { ShapeToolboxComponent } from './drawing-view/components/tools/shapes/shape-toolbox/shape-toolbox.component';
import { WelcomeWindowComponent } from './drawing-view/components/welcome-window/welcome-window.component';
import { DrawingViewModule } from './drawing-view/drawing-view.module';
import { LocalStorageService } from './services/local_storage/LocalStorageService';
@NgModule({
  declarations: [
    AppComponent,
    ModalWindowComponent as Type<ModalWindowComponent>,
    WelcomeWindowComponent,
    ShapeToolboxComponent,
    NewDrawingWindowComponent,
    MockCanvasComponent,
    RectangleComponent,
  ],
  imports: [
    DrawingViewModule,
    BrowserModule,
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
  ],
  providers: [ MatDialogConfig, LocalStorageService, MockCanvasComponent,
    { provide: MatDialogRef, useValue: {} },
  { provide: MAT_DIALOG_DATA, useValue: [] }, ],
  bootstrap: [AppComponent],
  entryComponents: [ModalWindowComponent as Type<ModalWindowComponent>, WelcomeWindowComponent, NewDrawingWindowComponent],
})
export class AppModule { }
