import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColorService } from 'src/app/services/color_service/color.service';
import { LineAbstract } from '../../assets/abstracts/line-abstract/line-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/constants/tool-constants';
import { SaveService } from 'src/app/services/save-service/save.service';

@Component({
  selector: 'app-tools-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
})
export class LineComponent extends LineAbstract implements OnInit, OnDestroy {

  constructor(saveRef: SaveService, attributesService: AttributesService, colorService: ColorService) {
    super(saveRef, attributesService, colorService);
    this.stroke.id = ToolConstants.TOOL_ID.LINE;
  }

  // Abstract & Overridden methods

  ngOnInit(): void {
    if (this.attributesService.lineAttributes.wasSaved) {
      this.stroke.strokeWidth = this.attributesService.lineAttributes.savedStrokeWidth;
      this.stroke.strokeDashArray = this.attributesService.lineAttributes.savedTraceMode;
    }
    this.setTraceMode(this.traceMode);
    this.setJunctionMode(this.junctionMode);
  }

  ngOnDestroy(): void {
    this.saveAttribute();
  }

  saveAttribute(): void {
    this.attributesService.lineAttributes.savedJunctionMode = this.stroke.strokeLinejoin;
    this.attributesService.lineAttributes.savedTraceMode = this.stroke.strokeDashArray;
    this.attributesService.lineAttributes.savedStrokeWidth = this.stroke.strokeWidth;
    this.attributesService.lineAttributes.wasSaved = true;
  }

}
