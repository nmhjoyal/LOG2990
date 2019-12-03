import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { ShapeAbstract } from '../../assets/abstracts/shape-abstract/shape-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/constants/tool-constants';

@Component({
  selector: 'app-tools-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss'],
})
export class RectangleComponent extends ShapeAbstract implements OnInit, OnDestroy {

  constructor(saveRef: SaveService, attributesServiceRef: AttributesService, colourServiceRef: ColourService) {
    super(saveRef, attributesServiceRef, colourServiceRef);
    this.shape.id = ToolConstants.TOOL_ID.RECTANGLE;
  }

  // Abstract & Overridden methods

  ngOnInit(): void {
    if (this.attributesService.rectangleAttributes.wasSaved) {
      this.shape.strokeWidth = this.attributesService.rectangleAttributes.savedStrokeWidth;
      this.traceMode = this.attributesService.rectangleAttributes.savedTraceMode;
    }
    this.setTraceMode(this.traceMode);
    this.colourService.data.subscribe((colour: string[]) => {
      this.shape.primaryColour = colour[0];
      this.shape.secondaryColour = colour[1];
    });
  }

  ngOnDestroy(): void {
    this.attributesService.rectangleAttributes.savedTraceMode = this.traceMode;
    this.attributesService.rectangleAttributes.savedStrokeWidth = this.shape.strokeWidth;
    this.attributesService.rectangleAttributes.wasSaved = true;
  }

  protected calculateDimensions(): void {
    super.calculateDimensions();
    const shapeOffset = this.shape.strokeWidth / 2;
    this.shape.x =  this.previewBox.x + shapeOffset;
    this.shape.y =  this.previewBox.y + shapeOffset;
    this.shape.width = this.previewBox.width > this.shape.strokeWidth ? this.previewBox.width - this.shape.strokeWidth : 0;
    this.shape.height = this.previewBox.height > this.shape.strokeWidth ? this.previewBox.height - this.shape.strokeWidth : 0;

    if (this.shiftDown ) {
      const minValue = Math.min(this.shape.height, this.shape.width);
      this.shape.height = minValue;
      this.shape.width = minValue;
      // Centrage du carré
      this.shape.x += this.previewBox.width / 2 -
        this.shape.width / 2 -
        this.shape.strokeWidth / 2;
      this.shape.y += this.previewBox.height / 2 -
        this.shape.height / 2 -
        this.shape.strokeWidth / 2;
    }
  }
}
