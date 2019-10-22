import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { INewDrawingModalData } from '../new-drawing-window/INewDrawingModalData';
import { ToolAbstract } from '../tools/assets/abstracts/tool-abstract/tool-abstract';
import { IDrawingTool } from '../tools/assets/interfaces/drawing-tool-interface';
import { IShape } from '../tools/assets/interfaces/shape-interface';
import { Id, ToolConstants } from '../tools/assets/tool-constants';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent {

  toolId = Id;
  @ViewChild('activeTool', {static: false}) activeTool: ToolAbstract;

  constructor(@Inject(MAT_DIALOG_DATA) protected data: INewDrawingModalData,
              public toolHandler: ToolHandlerService, public colorService: ColorService) {
  }

  applyColourToCanvas(): void {
    if (this.toolHandler.colourApplicatorSelected) {
      this.data.drawingColor = this.colorService.color[ToolConstants.PRIMARY_COLOUR_INDEX];
    }
    else if(this.toolHandler.pipetteSelected) {
      this.colorService.color[0] = this.data.drawingColor;
    }
  }

  getColorFromCanvas(event: MouseEvent): void {
    event.preventDefault();
    if(this.toolHandler.pipetteSelected) {
      this.colorService.color[1] = this.data.drawingColor;
    }
  }

  applyColourToLine(line: IDrawingTool): void {
    if (this.toolHandler.colourApplicatorSelected) {
      line.color = this.colorService.color[ToolConstants.PRIMARY_COLOUR_INDEX];
    }
    else if(this.toolHandler.pipetteSelected) {
      this.colorService.color[0] = line.color;
    }
  }

  getColorFromLine(event: MouseEvent, line: IDrawingTool): void {
    event.preventDefault();
    if(this.toolHandler.pipetteSelected) {
      this.colorService.color[1] = line.color;
    }
  }

  applyColourToShape(event: MouseEvent, shape: IShape): void {
    if (this.toolHandler.colourApplicatorSelected && shape.primaryColor !== 'none') {
      shape.primaryColor = this.colorService.color[ToolConstants.PRIMARY_COLOUR_INDEX];
    }
    else if(this.toolHandler.pipetteSelected) {
      this.getColorFromShape(event, 0, shape);
    }
  }

  applySecondaryColourToShape(event: MouseEvent, shape: IShape): void {
    event.preventDefault();
    if (this.toolHandler.colourApplicatorSelected && shape.secondaryColor !== 'none') {
      shape.secondaryColor = this.colorService.color[ToolConstants.SECONDARY_COLOUR_INDEX];
    }
    else if(this.toolHandler.pipetteSelected) {
      this.getColorFromShape(event, 1, shape);
    }
  }

  getColorFromShape(event: MouseEvent, colorIndex: number, shape: IShape): void {
    if(this.isStroke(event, shape)) {
      this.colorService.color[colorIndex] = shape.secondaryColor;
    }
    else {
      this.colorService.color[colorIndex] = shape.primaryColor;
    }
  }

  isStroke(event: MouseEvent, shape: IShape): boolean {
    switch (shape.id){
      case (Id.RECTANGLE):
        return (event.offsetX <= shape.x + shape.strokeWidth || event.offsetY <= shape.y + shape.strokeWidth || 
          event.offsetX >= shape.x + shape.width - shape.strokeWidth || event.offsetY >= shape.y + shape.height - shape.strokeWidth);
      default:
        return false;
    }
  }
}
