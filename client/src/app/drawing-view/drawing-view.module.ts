import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CanvasComponent } from './components/canvas/canvas.component';
import { CrayonComponent } from './components/tools/drawing-tools/crayon/crayon.component';
import { DrawingToolToolboxComponent } from './components/tools/drawing-tools/drawing-tool-toolbox/drawing-tool-toolbox.component';
import { PaintbrushComponent } from './components/tools/drawing-tools/paintbrush/paintbrush.component';
import { AttributesService } from './components/tools/assets/attributes/attributes.service';
import { RectangleComponent } from './components/tools/shapes/rectangle/rectangle.component';

@NgModule({
  declarations: [
    CanvasComponent,
    CrayonComponent,
    PaintbrushComponent,
    DrawingToolToolboxComponent,
    RectangleComponent,
],

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

  exports: [
    DrawingToolToolboxComponent,
    CanvasComponent,
    BrowserModule,
    HttpClientModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
  ],

  providers: [AttributesService],
  bootstrap: [CanvasComponent],
  entryComponents: [],
})
export class DrawingViewModule { }
