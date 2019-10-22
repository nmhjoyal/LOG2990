import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { ShapeAbstract } from '../../assets/abstracts/shape-abstract/shape-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/tool-constants';

@Component({
  selector: 'app-tools-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss'],
})
export class RectangleComponent extends ShapeAbstract implements OnInit, OnDestroy {

  constructor(toolServiceRef: ToolHandlerService, attributesServiceRef: AttributesService, colorServiceRef: ColorService) {
    super(toolServiceRef, attributesServiceRef, colorServiceRef);
    this.shape.id = ToolConstants.TOOL_ID.RECTANGLE;
  }

  // Abstract & Overridden methods

  ngOnInit(): void {
    if (this.attributesService.rectangleAttributes.wasSaved) {
      this.shape.strokeWidth = this.attributesService.rectangleAttributes.savedStrokeWidth;
      this.traceMode = this.attributesService.rectangleAttributes.savedTraceMode;
    }
    this.setTraceMode(this.traceMode);
  }

  ngOnDestroy(): void {
    this.attributesService.rectangleAttributes.savedTraceMode = this.traceMode;
    this.attributesService.rectangleAttributes.savedStrokeWidth = this.shape.strokeWidth;
    this.attributesService.rectangleAttributes.wasSaved = true;
  }

  protected calculateDimensions(): void {
    super.calculateDimensions();
    const shapeOffset = this.shape.strokeWidth / NumericalValues.TWO;
    this.shape.x =  this.previewBox.x + shapeOffset;
    this.shape.y =  this.previewBox.y + shapeOffset;
    this.shape.width = this.previewBox.width > this.shape.strokeWidth ? this.previewBox.width - this.shape.strokeWidth : 0;
    this.shape.height = this.previewBox.height > this.shape.strokeWidth ? this.previewBox.height - this.shape.strokeWidth : 0;

    if (this.shiftDown ) {
      const minValue = Math.min(this.shape.height, this.shape.width);
      this.shape.height = minValue;
      this.shape.width = minValue;
      // Centrage du carré
      this.shape.x += this.previewBox.width / NumericalValues.TWO -
        this.shape.width / NumericalValues.TWO -
        this.shape.strokeWidth / NumericalValues.TWO;
      this.shape.y += this.previewBox.height / NumericalValues.TWO -
        this.shape.height / NumericalValues.TWO -
        this.shape.strokeWidth / NumericalValues.TWO;
    }
  }
}
