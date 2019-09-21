import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CanvasComponent } from './components/canvas/canvas.component';
import { LateralBarComponent } from './components/lateral-bar/lateral-bar.component';
import { ModalWindowComponent } from './components/modal-window/modal-window.component';
import { ToolsComponent } from './components/tools/tools.component';
import { WelcomeWindowComponent } from './components/welcome-window/welcome-window.component';

@NgModule({
  declarations: [
    ToolsComponent,
    CanvasComponent,
    WelcomeWindowComponent,
    LateralBarComponent,
    ModalWindowComponent,
    WelcomeWindowComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ModalWindowComponent,
    WelcomeWindowComponent,
    CommonModule,
  ],
})
export class DrawingViewModule { }
