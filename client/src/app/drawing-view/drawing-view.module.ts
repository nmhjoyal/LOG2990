import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsComponent } from './components/tools/tools.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { WelcomeWindowComponent } from './components/welcome-window/welcome-window.component';
import { LateralBarComponent } from './components/lateral-bar/lateral-bar.component';
import { SvgTestComponent } from './components/tools/svg-test/svg-test.component';



@NgModule({
  declarations: [ToolsComponent, CanvasComponent, WelcomeWindowComponent, LateralBarComponent, SvgTestComponent],
  imports: [
    CommonModule
  ],
  exports: [ToolsComponent, CanvasComponent, WelcomeWindowComponent, LateralBarComponent, SvgTestComponent, CommonModule]
})
export class DrawingViewModule { }
