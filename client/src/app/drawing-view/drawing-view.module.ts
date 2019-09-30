import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CanvasComponent } from './components/canvas/canvas.component';
import { LateralBarComponent } from './components/lateral-bar/lateral-bar.component';
import { MockCanvasComponent } from './components/mock-canvas/mock-canvas.component';
import { RectangleComponent } from './components/tools/shapes/rectangle/rectangle.component';
import { ShapeToolboxComponent } from './components/tools/shapes/shape-toolbox/shape-toolbox.component';
import { ToolsComponent } from './components/tools/tools.component';

@NgModule({
  declarations: [
    ToolsComponent,
    CanvasComponent,
    LateralBarComponent,
    RectangleComponent,
    ShapeToolboxComponent,
    MockCanvasComponent, ],

  exports: [MockCanvasComponent],
  
  imports: [
    BrowserModule,
    HttpClientModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
  ],
  providers: [{ provide: MatDialogRef, useValue: {} },
  { provide: MAT_DIALOG_DATA, useValue: [] }, ],
  bootstrap: [MockCanvasComponent],
  entryComponents: [],
})
export class DrawingViewModule { }
