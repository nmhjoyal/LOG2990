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

  // Abstract & Overridden methods

  ngOnInit(): void {
    if (this.attributesService.attributes.wasSaved) {
      this.shape.strokeWidth = this.attributesService.attributes.savedStrokeWidth;
      this.shape.pointWidth = this.attributesService.attributes.savedPointWidth;
      this.pointMode = this.attributesService.attributes.savedPointMode;
    }
    this.setTraceMode(this.pointMode);
  }

  ngOnDestroy(): void {
    this.attributesService.attributes.savedPointMode = this.pointMode;
    this.attributesService.attributes.savedPointWidth = this.shape.pointWidth;
    this.attributesService.attributes.savedStrokeWidth = this.shape.strokeWidth;
    this.attributesService.attributes.wasSaved = true;
  }

}
