import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
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
    if (this.attributesService.attributes.wasSaved) {
      this.shape.strokeWidth = this.attributesService.attributes.savedStrokeWidth;
      this.traceMode = this.attributesService.attributes.savedTraceMode;
    }
    this.setTraceMode(this.traceMode);
  }

  ngOnDestroy(): void {
    this.attributesService.attributes.savedTraceMode = this.traceMode;
    this.attributesService.attributes.savedStrokeWidth = this.shape.strokeWidth;
    this.attributesService.attributes.wasSaved = true;
  }

  protected calculateDimensions(): void {
    super.calculateDimensions();
    if (this.shiftDown ) {
      const minValue = Math.min(this.shape.height, this.shape.width);
      this.shape.height = minValue;
      this.shape.width = minValue;
    }
  }
}
