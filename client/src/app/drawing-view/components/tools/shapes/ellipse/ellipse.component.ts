import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ShapeAbstract } from '../../assets/abstracts/shape-abstract/shape-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/tool-constants';

@Component({
  selector: 'app-ellipse',
  templateUrl: './ellipse.component.html',
  styleUrls: ['./ellipse.component.scss'],
})
export class EllipseComponent extends ShapeAbstract implements OnInit, OnDestroy {

  constructor(toolServiceRef: ToolHandlerService, attributesServiceRef: AttributesService, colorServiceRef: ColorService) {
    super(toolServiceRef, attributesServiceRef, colorServiceRef);
    this.shape.id = ToolConstants.TOOL_ID.ELLIPSE;
  }

  // Abstract&Overridden methods

  ngOnInit(): void {
    if (this.attributesService.ellipseAttributes.wasSaved) {
      this.shape.strokeWidth = this.attributesService.ellipseAttributes.savedStrokeWidth;
      this.traceMode = this.attributesService.ellipseAttributes.savedTraceMode;
    }
    this.setTraceMode(this.traceMode);
  }

  ngOnDestroy(): void {
    this.attributesService.ellipseAttributes.savedTraceMode = this.traceMode;
    this.attributesService.ellipseAttributes.savedStrokeWidth = this.shape.strokeWidth;
    this.attributesService.ellipseAttributes.wasSaved = true;
  }

  protected calculateDimensions(): void {
    this.previewBox.x = this.cursorX < this.initialX ? this.cursorX : this.initialX;
    this.previewBox.y = this.cursorY < this.initialY ? this.cursorY : this.initialY;
    this.previewBox.width = Math.abs(this.cursorX - this.initialX);
    this.previewBox.height = Math.abs(this.cursorY - this.initialY);

    // tslint:disable:no-magic-numbers
    this.shape.width = this.previewBox.width / 2;         // horizontal radius
    this.shape.height = this.previewBox.height / 2;       // vertical radius
    // tslint:enable:no-magic-numbers
    this.shape.x = this.previewBox.x + this.shape.width;  // x coordinate for center
    this.shape.y = this.previewBox.y + this.shape.height; // y coordinate for center

    if (this.shiftDown ) {
      const minValue = Math.min(this.shape.height, this.shape.width);
      this.shape.height = minValue;
      this.shape.width = minValue;
    }
  }
}
