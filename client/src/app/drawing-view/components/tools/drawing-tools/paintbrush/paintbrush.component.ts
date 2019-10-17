import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';

import { DrawingToolsAbstract } from '../../assets/drawing-tools-abstract';
import { ToolConstants } from '../../assets/tool-constants';

@Component({
  selector: 'app-paintbrush',
  templateUrl: './paintbrush.component.html',
  styleUrls: ['./paintbrush.component.scss'],
})
export class PaintbrushComponent extends DrawingToolsAbstract implements OnInit, OnDestroy {

  constructor(myDrawingToolService: ToolHandlerService) {
    super(myDrawingToolService);
    this.stroke.id = ToolConstants.TOOL_ID.PAINTBRUSH;
    this.stroke.strokeWidth = myDrawingToolService.paintbrushStrokeWidth;
    this.stroke.filter = myDrawingToolService.paintbrushFilter;
  }

    // overwritten method to save attributes
  saveAttribute() {
    this.drawingToolService.paintbrushStrokeWidth = this.stroke.strokeWidth;
    this.drawingToolService.paintbrushFilter = this.stroke.filter;
  }

  ngOnInit() {
    // empty block
  }

  ngOnDestroy() {
    this.saveAttribute();
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
