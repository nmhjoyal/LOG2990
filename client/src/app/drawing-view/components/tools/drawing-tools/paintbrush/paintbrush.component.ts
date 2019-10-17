import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';

import { DrawingToolsAbstract } from '../../assets/drawing-tools-abstract';
import { ToolConstants } from '../../assets/tool-constants';
import { AttributesService } from '../../assets/attributes/attributes.service';

@Component({
  selector: 'app-paintbrush',
  templateUrl: './paintbrush.component.html',
  styleUrls: ['./paintbrush.component.scss'],
})
export class PaintbrushComponent extends DrawingToolsAbstract implements OnInit, OnDestroy {

  constructor(toolServiceRef: ToolHandlerService, attributeServiceRef: AttributesService) {
    super(toolServiceRef, attributeServiceRef);
    this.stroke.id = ToolConstants.TOOL_ID.PAINTBRUSH;
  }

  ngOnInit(): void {
    if(this.attributesService.paintbrushAttributes.wasSaved) {
      this.stroke.strokeWidth = this.attributesService.paintbrushAttributes.savedStrokeWidth;
      this.stroke.filter = this.attributesService.paintbrushAttributes.savedFilter;
    }
  }

  ngOnDestroy(): void {
    this.attributesService.paintbrushAttributes.savedStrokeWidth = this.stroke.strokeWidth;
    this.attributesService.paintbrushAttributes.savedFilter = this.stroke.filter;
  }

  setFilter(n: number): void {
    switch (n) {
      case 0:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER0;
        break;
      case 1:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER1;
        break;
      case 2:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER2;
        break;
      case 3:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER3;
        break;
      case 4:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER4;
        break;
      case 5:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER5;
        break;
      default:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER0;
        break;
    }
  }

}
