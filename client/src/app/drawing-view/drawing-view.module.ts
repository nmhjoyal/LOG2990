import { CommonModule } from '@angular/common';
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
import { CrayonComponent } from './components/tools/drawing-tools/crayon/crayon.component';
import { DrawingToolToolboxComponent } from './components/tools/drawing-tools/drawing-tool-toolbox/drawing-tool-toolbox.component';
import { PinceauComponent } from './components/tools/drawing-tools/pinceau/pinceau.component';
import { SvgTestComponent } from './components/tools/svg-test/svg-test.component';
import { ToolsComponent } from './components/tools/tools.component';

@NgModule({
  declarations: [
    ToolsComponent,
    CanvasComponent,
    LateralBarComponent,
    SvgTestComponent,
    CrayonComponent,
    PinceauComponent,
    DrawingToolToolboxComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    CommonModule,
  ],
  exports: [ToolsComponent, CanvasComponent, LateralBarComponent, SvgTestComponent, CommonModule, CrayonComponent, PinceauComponent, DrawingToolToolboxComponent],
  providers: [MockCanvasComponent,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }, ],
})
export class DrawingViewModule { }
