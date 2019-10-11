import { Component, Input, OnInit } from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ModeType } from '../../assets/tool-constants';
import { DrawingToolsAbstract } from '../drawing-tools-abstract';
import { CanvasComponent } from '../../../canvas/canvas.component';

@Component({
  selector: 'app-drawing-tool-toolbox',
  templateUrl: './drawing-tool-toolbox.component.html',
  styleUrls: ['./drawing-tool-toolbox.component.scss'],
})
export class DrawingToolToolboxComponent implements OnInit {

  @Input() canvas: CanvasComponent;
  mode = ModeType;

  constructor(protected storage: ToolHandlerService) {
    // empty block
  }

  ngOnInit() {
    // empty block
  }

  getComponent(): DrawingToolsAbstract {
    return this.canvas.activeTool;
  }

}
