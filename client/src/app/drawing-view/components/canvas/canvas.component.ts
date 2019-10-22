import { Component, Inject, ViewChild, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { INewDrawingModalData } from '../new-drawing-window/INewDrawingModalData';
import { ToolAbstract } from '../tools/assets/abstracts/tool-abstract/tool-abstract';
import { IDrawingTool } from '../tools/assets/interfaces/drawing-tool-interface';
import { IShape } from '../tools/assets/interfaces/shape-interface';
import { Id, ToolConstants } from '../tools/assets/tool-constants';
import { Gridservice } from '../../../services/grid/grid.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent {

  toolId = Id;
  @ViewChild('activeTool', {static: false}) activeTool: ToolAbstract;

  // Grid declarations
  gridElementC = document.getElementById('myGrid');
  sliderElementC: HTMLInputElement;
  // End grid declarations

  constructor(@Inject(MAT_DIALOG_DATA) protected data: INewDrawingModalData,
              public toolHandler: ToolHandlerService, public colorService: ColorService, private gridsvc: Gridservice) {

              }

  applyColourToCanvas(): void {
    if (this.toolHandler.colourApplicatorSelected) {
      this.data.drawingColor = this.colorService.color[ToolConstants.PRIMARY_COLOUR_INDEX];
    } else if (this.toolHandler.pipetteSelected) {
      this.colorService.color[ToolConstants.PRIMARY_COLOUR_INDEX] = this.data.drawingColor;
    }
  }

  getColorFromCanvas(event: MouseEvent): void {
    event.preventDefault();
    if (this.toolHandler.pipetteSelected) {
      this.colorService.color[ToolConstants.SECONDARY_COLOUR_INDEX] = this.data.drawingColor;
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
    switch (shape.id) {
      case (Id.RECTANGLE):
        return (event.offsetX <= shape.x + shape.strokeWidth || event.offsetY <= shape.y + shape.strokeWidth ||
          event.offsetX >= shape.x + shape.width - shape.strokeWidth || event.offsetY >= shape.y + shape.height - shape.strokeWidth);
      case(Id.ELLIPSE):
          // tslint:disable:no-magic-numbers
        return (Math.pow(event.offsetX - shape.x, 2) / Math.pow(shape.width - shape.strokeWidth, 2) +
          Math.pow(event.offsetY - shape.y, 2) / Math.pow(shape.height - shape.strokeWidth, 2)) >= 1;
          // tslint:enable:no-magic-numbers
      default:
        return false;
    }
  }

  // Grid methods

  @HostListener('document:keydown.g', ['$event']) onKeydownHandlerGrid() {
    this.gridsvc.toggleGrid();
  }

  @HostListener('document:keydown.shift.+', ['$event']) onKeydownHandlerPlus() {
    const sliderElement = document.getElementById('sizeSlider') as HTMLInputElement;
    const stringInitialValue = sliderElement.value;
    const initialValue = Number(stringInitialValue);
    let newValue;
    if ((initialValue % 5) === 0) {
      newValue = initialValue + 5;
    } else {
      newValue = Math.ceil(initialValue / 5) * 5;
    }
    const stringNewValue = String(newValue);

    if (sliderElement) {
      sliderElement.setAttribute('value', stringNewValue);
      this.gridsvc.setSize();
    }

    this.sliderElementC = sliderElement;
  }

  @HostListener('document:keydown.-', ['$event']) onKeydownHandlerMinus() {
    const sliderElement = document.getElementById('sizeSlider') as HTMLInputElement;
    const stringInitialValue = sliderElement.value;
    const initialValue = Number(stringInitialValue);
    let newValue;
    if ((initialValue % 5) === 0) {
      newValue = initialValue - 5;
    } else {
      newValue = Math.floor(initialValue / 5) * 5;
    }
    const stringNewValue = String(newValue);

    if (sliderElement) {
      sliderElement.setAttribute('value', stringNewValue);
      this.gridsvc.setSize();
    }

    this.sliderElementC = sliderElement;
  }

  // End grid methods

}
