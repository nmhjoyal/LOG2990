import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TitleBarComponent } from './components/title-bar/title-bar.component';
import { LateralBarComponent } from './components/lateral-bar/lateral-bar.component';
import { ModalWindowComponent } from './components/modal-window/modal-window.component';
import { ToolsComponent } from './components/tools/tools.component';
import { WelcomeWindowComponent } from './components/welcome-window/welcome-window.component';
import { DrawViewComponent } from './draw-view/draw-view.component';

@NgModule({
  declarations: [
    ToolsComponent,
    TitleBarComponent,
    WelcomeWindowComponent,
    LateralBarComponent,
    ModalWindowComponent,
    WelcomeWindowComponent,
    DrawViewComponent,
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
