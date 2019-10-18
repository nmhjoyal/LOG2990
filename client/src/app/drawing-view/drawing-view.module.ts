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
import { AttributesService } from './components/tools/assets/attributes/attributes.service';
import { RectangleComponent } from './components/tools/shapes/rectangle/rectangle.component';
import { ShapeToolboxComponent } from './components/tools/shapes/shape-toolbox/shape-toolbox.component';

@NgModule({
  declarations: [
    CanvasComponent,
    RectangleComponent,
    ShapeToolboxComponent,
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
    CanvasComponent,
    ShapeToolboxComponent,
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
