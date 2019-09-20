import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsComponent } from './components/tools/tools.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { WelcomeWindowComponent } from './components/welcome-window/welcome-window.component';
import { LateralBarComponent } from './components/lateral-bar/lateral-bar.component';
import { ModalWindowComponent } from './components/modal-window/modal-window.component';



@NgModule({
  declarations: [ToolsComponent, CanvasComponent, WelcomeWindowComponent, LateralBarComponent, ModalWindowComponent],
  imports: [
    CommonModule
  ],
  exports: [ModalWindowComponent]
})
export class DrawingViewModule { }
