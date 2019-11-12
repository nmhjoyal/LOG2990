import { Component, Input, OnInit } from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { CanvasComponent } from '../../../canvas/canvas.component';
import { ToolAbstract } from '../../assets/abstracts/tool-abstract/tool-abstract';
import { Id, ModeType, PointType } from '../../assets/constants/tool-constants';

@Component({
  selector: 'app-drawing-tool-toolbox',
  templateUrl: './drawing-tool-toolbox.component.html',
  styleUrls: ['./drawing-tool-toolbox.component.scss'],
})
export class DrawingToolToolboxComponent implements OnInit {

  protected mode = ModeType;
  protected pointMode = PointType;
  protected toolId = Id;
  @Input() private canvas: CanvasComponent;

  constructor(protected toolHandler: ToolHandlerService) {
    // empty block
  }

  ngOnInit() {
    // empty block
  }

  getComponent(): ToolAbstract {
    return this.canvas.activeTool;
  }

}
