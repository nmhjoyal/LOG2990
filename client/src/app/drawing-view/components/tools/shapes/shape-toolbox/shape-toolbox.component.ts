import { Component, Input, OnInit } from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { MockCanvasComponent } from '../../../mock-canvas/mock-canvas.component';
import { ShapeAbstract } from '../../assets/shape-abstract';
import { ModeType } from '../../assets/tool-constants';

@Component({
  selector: 'app-shape-toolbox',
  templateUrl: './shape-toolbox.component.html',
  styleUrls: ['./shape-toolbox.component.scss'],
})
export class ShapeToolboxComponent implements OnInit {

  mode = ModeType;
  @Input() canvas: MockCanvasComponent;

  constructor(protected toolHandler: ToolHandlerService) {
    // empty body
  }

  ngOnInit(): void {
    // empty body
  }

  getComponent(): ShapeAbstract {  // change to parent of shapeAbstract
    return this.canvas.activeTool;
  }

}
