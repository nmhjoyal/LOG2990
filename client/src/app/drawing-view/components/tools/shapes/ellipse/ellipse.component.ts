import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { ShapeAbstract } from '../../assets/abstracts/shape-abstract/shape-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/constants/tool-constants';

@Component({
  selector: 'app-ellipse',
  templateUrl: './ellipse.component.html',
  styleUrls: ['./ellipse.component.scss'],
})
export class EllipseComponent extends ShapeAbstract implements OnInit, OnDestroy {

  constructor(saveRef: SaveService, attributesServiceRef: AttributesService, colourServiceRef: ColourService) {
    super(saveRef, attributesServiceRef, colourServiceRef);
    this.shape.id = ToolConstants.TOOL_ID.ELLIPSE;
  }

  // Abstract&Overridden methods

  ngOnInit(): void {
    if (this.attributesService.ellipseAttributes.wasSaved) {
      this.shape.strokeWidth = this.attributesService.ellipseAttributes.savedStrokeWidth;
      this.traceMode = this.attributesService.ellipseAttributes.savedTraceMode;
    }
    this.setTraceMode(this.traceMode);
    this.colourService.data.subscribe((colour: string[]) => {
      this.shape.primaryColour = colour[0];
      this.shape.secondaryColour = colour[1];
    });
  }

  ngOnDestroy(): void {
    this.attributesService.ellipseAttributes.savedTraceMode = this.traceMode;
    this.attributesService.ellipseAttributes.savedStrokeWidth = this.shape.strokeWidth;
    this.attributesService.ellipseAttributes.wasSaved = true;
  }

  protected calculateDimensions(): void {
    super.calculateDimensions();

    // horizontal radius
    this.shape.width = this.previewBox.width > this.shape.strokeWidth ?
      (this.previewBox.width - this.shape.strokeWidth) / 2 : 0;
    // vertical radius
    this.shape.height = this.previewBox.height > this.shape.strokeWidth ?
      (this.previewBox.height - this.shape.strokeWidth) / 2 : 0;
    this.shape.x = this.previewBox.x + this.previewBox.width / 2;  // x coordinate for center
    this.shape.y = this.previewBox.y + this.previewBox.height / 2; // y coordinate for center

    if (this.shiftDown ) {
      const minValue = Math.min(this.shape.height, this.shape.width);
      this.shape.height = minValue;
      this.shape.width = minValue;
    }
  }
}
