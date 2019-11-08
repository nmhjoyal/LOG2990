import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
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

  constructor(@Inject(MAT_DIALOG_DATA) protected data: INewDrawingModalData,
    public toolHandler: ToolHandlerService, public drawingStorage: DrawingStorageService,
    protected canvasData: CanvasInformationService, public colourService: ColourService) {
  }

  applyColourToCanvas(): void {
    if (this.toolHandler.selectedTool === this.toolId.COLOUR_APPLICATOR) {
      this.canvasData.data.drawingColour = this.colourService.colour[ToolConstants.PRIMARY_COLOUR_INDEX];
    } else if (this.toolHandler.selectedTool === this.toolId.PIPETTE) {
      this.colourService.colour[ToolConstants.PRIMARY_COLOUR_INDEX] = this.canvasData.data.drawingColour;
    }
  }

  getColourFromCanvas(event: MouseEvent): void {
    event.preventDefault();
    if (this.toolHandler.selectedTool === this.toolId.PIPETTE) {
      this.colourService.colour[ToolConstants.SECONDARY_COLOUR_INDEX] = this.canvasData.data.drawingColour;
    }
  }

  applyColourToLine(line: IDrawingTool): void {
    if (this.toolHandler.selectedTool === this.toolId.COLOUR_APPLICATOR) {
      line.colour = this.colourService.colour[ToolConstants.PRIMARY_COLOUR_INDEX];
    } else if (this.toolHandler.selectedTool === this.toolId.PIPETTE) {
      this.colourService.colour[ToolConstants.PRIMARY_COLOUR_INDEX] = line.colour;
    }
  }

  getColourFromLine(event: MouseEvent, line: IDrawingTool): void {
    event.preventDefault();
    if (this.toolHandler.selectedTool === this.toolId.PIPETTE) {
      this.colourService.colour[ToolConstants.SECONDARY_COLOUR_INDEX] = line.colour;
    }
  }

  applyColourToShape(event: MouseEvent, shape: IShape): void {
    if (this.toolHandler.selectedTool === this.toolId.COLOUR_APPLICATOR && shape.primaryColour !== 'none') {
      shape.primaryColour = this.colourService.colour[ToolConstants.PRIMARY_COLOUR_INDEX];
    } else if (this.toolHandler.selectedTool === this.toolId.PIPETTE) {
      this.getColourFromShape(event, ToolConstants.PRIMARY_COLOUR_INDEX, shape);
    }
  }

  applySecondaryColourToShape(event: MouseEvent, shape: IShape): void {
    event.preventDefault();
    if (this.toolHandler.selectedTool === this.toolId.COLOUR_APPLICATOR && shape.secondaryColour !== 'none') {
      shape.secondaryColour = this.colourService.colour[ToolConstants.SECONDARY_COLOUR_INDEX];
    } else if (this.toolHandler.selectedTool === this.toolId.PIPETTE) {
      this.getColourFromShape(event, ToolConstants.SECONDARY_COLOUR_INDEX, shape);
    }
  }

  getColourFromShape(event: MouseEvent, colourIndex: number, shape: IShape): void {
    if (this.isStroke(event, shape)) {
      this.colourService.colour[colourIndex] = shape.secondaryColour;
    } else {
      this.colourService.colour[colourIndex] = shape.primaryColour;
    }
  }

  isStroke(event: MouseEvent, shape: IShape): boolean {
    return ClickHelper.cursorTouchesObjectBorder(shape, ClickHelper.getXPosition(event), ClickHelper.getYPosition(event));
  }

}
