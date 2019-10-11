import { Component, Input, OnInit } from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { MockCanvasComponent } from '../../../mock-canvas/mock-canvas.component';
import { ModeType } from '../../assets/tool-constants';
import { DrawingToolsAbstract } from '../drawing-tools-abstract';

@Component({
  selector: 'app-drawing-tool-toolbox',
  templateUrl: './drawing-tool-toolbox.component.html',
  styleUrls: ['./drawing-tool-toolbox.component.scss'],
})
export class DrawingToolToolboxComponent implements OnInit {

  @Input() canvas: MockCanvasComponent;
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
