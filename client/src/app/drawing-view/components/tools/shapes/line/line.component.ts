import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { LineAbstract } from '../../assets/abstracts/line-abstract/line-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/tool-constants';

@Component({
  selector: 'app-tools-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
})
export class LineComponent extends LineAbstract implements OnInit, OnDestroy {

  constructor(toolServiceRef: ToolHandlerService, attributesServiceRef: AttributesService, colorServiceRef: ColorService) {
    super(toolServiceRef, attributesServiceRef, colorServiceRef);
    this.shape.id = ToolConstants.TOOL_ID.LINE;
  }

  // Abstract&Overridden methods

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
/*
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
  }*/
}
