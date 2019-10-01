import { NgModule } from '@angular/core';
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
})
export class DrawingViewModule { }
