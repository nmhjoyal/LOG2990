import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsComponent } from './components/tools/tools.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { WelcomeWindowComponent } from './components/welcome-window/welcome-window.component';
import { LateralBarComponent } from './components/lateral-bar/lateral-bar.component';
import { ShapesComponent } from './components/shapes/shapes.component';
import { RectangleComponent } from './components/shapes/rectangle/rectangle.component';



@NgModule({
  declarations: [ToolsComponent, CanvasComponent, WelcomeWindowComponent, LateralBarComponent, ShapesComponent, RectangleComponent],
  imports: [
    CommonModule
  ]
})
export class DrawingViewModule { }
