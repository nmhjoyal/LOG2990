import { Component, Input, OnInit } from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { CanvasComponent } from '../../../canvas/canvas.component';
import { ModeType } from '../../assets/tool-constants';
import { ShapeAbstract } from '../../assets/abstracts/shape-abstract/shape-abstract';

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

  getComponent(): ShapeAbstract {
    return this.canvas.activeTool;
  }

}
