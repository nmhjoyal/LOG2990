import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatMenuModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ParserService } from '../services/parser-service/parser.service';
import { SaveService } from '../services/save-service/save.service';
import { SelectorService } from '../services/selector-service/selector-service';
import { CanvasComponent } from './components/canvas/canvas.component';
import { PreviewCanvasComponent } from './components/modal-windows/gallery-window/preview-canvas/preview-canvas.component';
import { AttributesService } from './components/tools/assets/attributes/attributes.service';
import { CrayonComponent } from './components/tools/drawing-tools/crayon/crayon.component';
import { DrawingToolToolboxComponent } from './components/tools/drawing-tools/drawing-tool-toolbox/drawing-tool-toolbox.component';
import { EraserComponent } from './components/tools/drawing-tools/eraser/eraser.component';
import { PaintbrushComponent } from './components/tools/drawing-tools/paintbrush/paintbrush.component';
import { PenComponent } from './components/tools/drawing-tools/pen/pen.component';
import { SelectorComponent } from './components/tools/selector/selector.component';
import { EllipseComponent } from './components/tools/shapes/ellipse/ellipse.component';
import { LineComponent } from './components/tools/shapes/line/line.component';
import { PolygonComponent } from './components/tools/shapes/polygon/polygon.component';
import { RectangleComponent } from './components/tools/shapes/rectangle/rectangle.component';
import { StampComponent } from './components/tools/stamp/stamp.component';
import { TextComponent } from './components/tools/text/text.component';

@NgModule({
  declarations: [
    CanvasComponent,
    CrayonComponent,
    PaintbrushComponent,
    DrawingToolToolboxComponent,
    RectangleComponent,
    PolygonComponent,
    LineComponent,
    SelectorComponent,
    EllipseComponent,
    PreviewCanvasComponent,
    TextComponent,
    StampComponent,
    EraserComponent,
    PenComponent,
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
    PreviewCanvasComponent,
    CanvasComponent,
    BrowserModule,
    HttpClientModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
  ],

  providers: [AttributesService, SelectorService, SaveService],
  bootstrap: [CanvasComponent],
  entryComponents: [],
})
export class DrawingViewModule { }
