import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { LineAbstract } from '../../assets/abstracts/line-abstract/line-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/constants/tool-constants';

@Component({
  selector: 'app-tools-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
})
export class LineComponent extends LineAbstract implements OnInit, OnDestroy {

  constructor(saveRef: SaveService, attributesService: AttributesService, colourService: ColourService) {
    super(saveRef, attributesService, colourService);
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
    this.colourService.data.subscribe((colour: string[]) => {
      this.stroke.colour = colour[0];
    });
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
