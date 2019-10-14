import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { INewDrawingModalData } from '../new-drawing-window/INewDrawingModalData';
import { ShapeAbstract } from '../tools/assets/abstracts/shape-abstract/shape-abstract';
import { Id } from '../tools/assets/tool-constants';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent {

  toolID = Id;
  @ViewChild('activeTool', {static: false}) activeTool: ShapeAbstract; // put general tool abstract here

  constructor(@Inject(MAT_DIALOG_DATA) protected data: INewDrawingModalData, public toolHandler: ToolHandlerService) {
    // empty body
  }

}
