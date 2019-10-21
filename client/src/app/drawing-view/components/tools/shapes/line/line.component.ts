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

  constructor(toolService: ToolHandlerService, attributesService: AttributesService, colorService: ColorService) {
    super(toolService, attributesService, colorService);
    this.stroke.id = ToolConstants.TOOL_ID.LINE;
  }

  // Abstract & Overridden methods

  ngOnInit(): void {
    if (this.attributesService.lineAttributes.wasSaved) {
      this.stroke.strokeWidth = this.attributesService.lineAttributes.savedStrokeWidth;
      this.stroke.strokeDashArray = this.attributesService.lineAttributes.savedTraceMode;
      this.traceMode = this.attributesService.lineAttributes.savedTraceMode;
    }
    this.setTraceMode(1);
  }

  ngOnDestroy(): void {
    this.saveAttribute();
  }

  saveAttribute(): void {
    this.attributesService.lineAttributes.savedJunctionMode = this.junctionMode;
    // this.attributesService.lineAttributes.savedPointWidth = this.shape.pointWidth;
    this.attributesService.lineAttributes.savedTraceMode = this.traceMode;
    this.attributesService.lineAttributes.savedStrokeWidth = this.stroke.strokeWidth;
    this.attributesService.lineAttributes.wasSaved = true;
  }

}
