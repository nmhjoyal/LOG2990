import { Component, HostListener, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { GridService } from '../../../services/grid_service/grid.service';
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

  gridElementC = document.getElementById('myGrid');
  sliderElementC: HTMLInputElement;
  toolId = Id;
  @ViewChild('activeTool', {static: false}) activeTool: ToolAbstract;

  constructor(@Inject(MAT_DIALOG_DATA) protected data: INewDrawingModalData,
              public toolHandler: ToolHandlerService, public colorService: ColorService, public gridService: GridService) {
  }

  applyColourToCanvas(): void {
    if (this.toolHandler.colourApplicatorSelected) {
      this.data.drawingColor = this.colorService.color[ToolConstants.PRIMARY_COLOUR_INDEX];
    }
  }

  applyColourToLine(line: IDrawingTool): void {
    if (this.toolHandler.colourApplicatorSelected) {
      line.color = this.colorService.color[ToolConstants.PRIMARY_COLOUR_INDEX];
    }
  }

  applyColourToShape(shape: IShape): void {
    if (this.toolHandler.colourApplicatorSelected && shape.primaryColor !== 'none') {
      shape.primaryColor = this.colorService.color[ToolConstants.PRIMARY_COLOUR_INDEX];
    }
  }

  applySecondaryColourToShape(event: MouseEvent, shape: IShape): void {
    event.preventDefault();
    if (this.toolHandler.colourApplicatorSelected && shape.secondaryColor !== 'none') {
      shape.secondaryColor = this.colorService.color[ToolConstants.SECONDARY_COLOUR_INDEX];
    }
  }

  @HostListener('document:keydown.g', ['$event']) onKeydownHandlerGrid() {
    this.gridService.toggleGrid();
  }

  @HostListener('document:keydown.shift.+', ['$event']) onKeydownHandlerPlus() {
    const sliderElement = document.getElementById('sizeSlider') as HTMLInputElement;
    const stringInitialValue = sliderElement.value;
    const initialValue = Number(stringInitialValue);
    let newValue;

    if (!(initialValue % NumericalValues.GRID_OFFSET)) {
      newValue = initialValue + NumericalValues.GRID_OFFSET;
    } else {
      newValue = Math.ceil(initialValue / NumericalValues.GRID_OFFSET) * NumericalValues.GRID_OFFSET;
    }
    const stringNewValue = String(newValue);

    if (sliderElement != null) {
      sliderElement.setAttribute('value', stringNewValue);
      this.gridService.setSize(stringNewValue);
    }

    this.sliderElementC = sliderElement;
  }

  @HostListener('document:keydown.-', ['$event']) onKeydownHandlerMinus() {
    const sliderElement = document.getElementById('sizeSlider') as HTMLInputElement;
    const stringInitialValue = sliderElement.value;
    const initialValue = Number(stringInitialValue);
    let newValue;
    if (!(initialValue % NumericalValues.GRID_OFFSET)) {
      newValue = initialValue - NumericalValues.GRID_OFFSET;
    } else {
      newValue = Math.floor(initialValue / NumericalValues.GRID_OFFSET) * NumericalValues.GRID_OFFSET;
    }
    const stringNewValue = String(newValue);

    if (sliderElement != null) {
      sliderElement.setAttribute('value', stringNewValue);
      this.gridService.setSize(stringNewValue);
    }

    this.sliderElementC = sliderElement;
  }
}
}
