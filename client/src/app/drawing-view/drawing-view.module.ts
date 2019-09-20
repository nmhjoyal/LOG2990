import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CanvasComponent } from './components/canvas/canvas.component';
import { LateralBarComponent } from './components/lateral-bar/lateral-bar.component';
import { ToolsComponent } from './components/tools/tools.component';
import { WelcomeWindowComponent } from './components/welcome-window/welcome-window.component';

@NgModule({
  declarations: [ToolsComponent, CanvasComponent, WelcomeWindowComponent, LateralBarComponent],
  imports: [
    CommonModule,
  ],
})
export class DrawingViewModule { }
