import { Component, OnDestroy, OnInit} from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ToolConstants } from '../../assets/tool-constants';
import { DrawingToolsAbstract } from '../../assets/drawing-tools-abstract';

@Component({
  selector: 'app-crayon',
  templateUrl: './crayon.component.html',
  styleUrls: ['./crayon.component.scss'],
})
export class CrayonComponent extends DrawingToolsAbstract implements OnInit, OnDestroy {

  constructor(myDrawingToolService: ToolHandlerService) {
    super(myDrawingToolService);
    this.stroke.id = ToolConstants.TOOL_ID.CRAYON;
    this.stroke.strokeWidth = myDrawingToolService.crayonStrokeWidth;
  }

  // overwritten method to save attributes

  saveAttribute() {
    this.drawingToolService.crayonStrokeWidth = this.stroke.strokeWidth;
  }

  ngOnInit() {
    // empty block
  }

  ngOnDestroy() {
    this.saveAttribute();
  }
}
