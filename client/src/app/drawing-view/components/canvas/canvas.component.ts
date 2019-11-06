import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { Gridservice } from '../../../services/grid/grid.service';
import { INewDrawingModalData } from '../modal-windows/new-drawing-window/INewDrawingModalData';
import { ToolAbstract } from '../tools/assets/abstracts/tool-abstract/tool-abstract';
import { Id, ToolConstants } from '../tools/assets/constants/tool-constants';
import { IDrawingTool } from '../tools/assets/interfaces/drawing-tool-interface';
import { IShape } from '../tools/assets/interfaces/shape-interface';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent {

  toolId = Id;
  @ViewChild('activeTool', { static: false }) activeTool: ToolAbstract;

  constructor(@Inject(MAT_DIALOG_DATA)
    protected data: INewDrawingModalData,
    public toolHandler: ToolHandlerService,
    protected canvasData: CanvasInformationService,
    public colorService: ColorService,
    protected gridService: Gridservice) {
  }

  applyColourToCanvas(): void {
    if (this.toolHandler.colourApplicatorSelected) {
      this.canvasData.data.drawingColor = this.colorService.color[ToolConstants.PRIMARY_COLOUR_INDEX];
    } else if (this.toolHandler.pipetteSelected) {
      this.colorService.color[ToolConstants.PRIMARY_COLOUR_INDEX] = this.canvasData.data.drawingColor;
    }
  }

  getColorFromCanvas(event: MouseEvent): void {
    event.preventDefault();
    if (this.toolHandler.pipetteSelected) {
      this.colorService.color[ToolConstants.SECONDARY_COLOUR_INDEX] = this.canvasData.data.drawingColor;
    }
  }

  applyColourToLine(line: IDrawingTool): void {
    if (this.toolHandler.colourApplicatorSelected) {
      line.color = this.colorService.color[ToolConstants.PRIMARY_COLOUR_INDEX];
    } else if (this.toolHandler.pipetteSelected) {
      this.colorService.color[ToolConstants.PRIMARY_COLOUR_INDEX] = line.color;
    }
  }

  getColorFromLine(event: MouseEvent, line: IDrawingTool): void {
    event.preventDefault();
    if (this.toolHandler.pipetteSelected) {
      this.colorService.color[ToolConstants.SECONDARY_COLOUR_INDEX] = line.color;
    }
  }

  applyColourToShape(event: MouseEvent, shape: IShape): void {
    if (this.toolHandler.colourApplicatorSelected && shape.primaryColor !== 'none') {
      shape.primaryColor = this.colorService.color[ToolConstants.PRIMARY_COLOUR_INDEX];
    } else if (this.toolHandler.pipetteSelected) {
      this.getColorFromShape(event, ToolConstants.PRIMARY_COLOUR_INDEX, shape);
    }
  }

  applySecondaryColourToShape(event: MouseEvent, shape: IShape): void {
    event.preventDefault();
    if (this.toolHandler.colourApplicatorSelected && shape.secondaryColor !== 'none') {
      shape.secondaryColor = this.colorService.color[ToolConstants.SECONDARY_COLOUR_INDEX];
    } else if (this.toolHandler.pipetteSelected) {
      this.getColorFromShape(event, ToolConstants.SECONDARY_COLOUR_INDEX, shape);
    }
  }

  getColorFromShape(event: MouseEvent, colorIndex: number, shape: IShape): void {
    if (this.isStroke(event, shape)) {
      this.colorService.color[colorIndex] = shape.secondaryColor;
    } else {
      this.colorService.color[colorIndex] = shape.primaryColor;
    }
  }

  isStroke(event: MouseEvent, shape: IShape): boolean {
    return ClickHelper.cursorTouchesObjectBorder(shape, ClickHelper.getXPosition(event), ClickHelper.getYPosition(event));
  }

}
