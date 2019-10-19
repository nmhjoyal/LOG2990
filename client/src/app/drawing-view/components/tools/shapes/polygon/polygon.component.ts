import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ShapeAbstract } from '../../assets/abstracts/tool-abstract/shape-abstract/shape-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/tool-constants';

@Component({
  selector: 'app-tools-polygon',
  templateUrl: './polygon.component.html',
  styleUrls: ['./polygon.component.scss'],
})
export class PolygonComponent extends ShapeAbstract implements OnInit, OnDestroy {

  constructor(toolServiceRef: ToolHandlerService, attributesServiceRef: AttributesService, colorServiceRef: ColorService) {
    super(toolServiceRef, attributesServiceRef, colorServiceRef);
    this.shape.id = ToolConstants.TOOL_ID.POLYGON;
  }

  // Abstract&Overridden methods

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
    if (this.shiftDown ) {
      const minValue = Math.min(this.shape.height, this.shape.width);
      this.shape.height = minValue;
      this.shape.width = minValue;
      // Centrage du carré
      // tslint:disable:no-magic-numbers
      this.shape.x += this.previewBox.width / 2 - this.shape.width / 2 - this.shape.strokeWidth / 2;
      this.shape.y += this.previewBox.height / 2 - this.shape.height / 2 - this.shape.strokeWidth / 2;
      // tslint:enable:no-magic-numbers
    }
  }
}
