import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { INewDrawingModalData } from '../modal-windows/new-drawing-window/INewDrawingModalData';
import { ShapeAbstract } from '../tools/assets/abstracts/shape-abstract/shape-abstract';
import { Id } from '../tools/assets/tool-constants';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent {

  toolId = Id;
  @ViewChild('activeTool', { static: false }) activeTool: ShapeAbstract; // put general tool abstract here

  constructor(@Inject(MAT_DIALOG_DATA) protected data: INewDrawingModalData,
    public toolHandler: ToolHandlerService, protected canvasData: CanvasInformationService, public colorService: ColorService) {
  }

}
