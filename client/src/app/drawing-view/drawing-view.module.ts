import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsComponent } from './components/tools/tools.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { WelcomeWindowComponent } from './components/welcome-window/welcome-window.component';
import { LateralBarComponent } from './components/lateral-bar/lateral-bar.component';
import { RectangleComponent } from './components/tools/shapes/rectangle/rectangle.component';
import { ShapeToolboxComponent } from './components/tools/shapes/shape-toolbox/shape-toolbox.component';



@NgModule({
  declarations: [ToolsComponent, 
    CanvasComponent, 
    WelcomeWindowComponent, 
    LateralBarComponent, 
    RectangleComponent, ShapeToolboxComponent],
  imports: [
    CommonModule
  ]
})
export class DrawingViewModule { }
