import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
<<<<<<< HEAD
import { CommonModule } from '@angular/common';
import { ToolsComponent } from './components/tools/tools.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { WelcomeWindowComponent } from './components/welcome-window/welcome-window.component';
import { LateralBarComponent } from './components/lateral-bar/lateral-bar.component';
import { SvgTestComponent } from './components/tools/svg-test/svg-test.component';
import { CrayonComponent } from './components/tools/drawing-tools/crayon/crayon.component';
import { PinceauComponent } from './components/tools/drawing-tools/pinceau/pinceau.component';
import { DrawingToolToolboxComponent } from './components/tools/drawing-tools/drawing-tool-toolbox/drawing-tool-toolbox.component';



@NgModule({
  declarations: [ToolsComponent, CanvasComponent, WelcomeWindowComponent, LateralBarComponent, SvgTestComponent, CrayonComponent, PinceauComponent, DrawingToolToolboxComponent],
  imports: [
    CommonModule
  ],
  exports: [ToolsComponent, CanvasComponent, WelcomeWindowComponent, LateralBarComponent, SvgTestComponent, CommonModule]
=======
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from '../components/app/app.component';
import { MockCanvasComponent } from './components/mock-canvas/mock-canvas.component';

@NgModule({
  declarations: [
    AppComponent,
    MockCanvasComponent,
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
  providers: [{ provide: MatDialogRef, useValue: {} },
  { provide: MAT_DIALOG_DATA, useValue: [] }, ],
  bootstrap: [AppComponent],
>>>>>>> ee9483f206aadaeb885194748b5c06daa5f9091b
})
export class DrawingViewModule { }
