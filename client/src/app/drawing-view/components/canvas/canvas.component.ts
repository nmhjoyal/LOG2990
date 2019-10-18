import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { INewDrawingModalData } from '../new-drawing-window/INewDrawingModalData';
import { Id } from '../tools/assets/tool-constants';
import { StrokeAbstract } from '../tools/assets/abstracts/stroke-abstract/stroke-abstract';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent {

  toolId = Id;
  @ViewChild('activeTool', {static: false}) activeTool: StrokeAbstract; // put general tool abstract here

  constructor(@Inject(MAT_DIALOG_DATA) protected data: INewDrawingModalData,
              public toolHandler: ToolHandlerService, public colorService: ColorService) {
  }

}
