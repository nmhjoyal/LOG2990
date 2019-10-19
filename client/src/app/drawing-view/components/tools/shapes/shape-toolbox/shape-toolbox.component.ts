import { Component, Input, OnInit } from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { CanvasComponent } from '../../../canvas/canvas.component';
import { LineAbstract } from '../../assets/abstracts/line-abstract/line-abstract';
// import { ShapeAbstract } from '../../assets/abstracts/shape-abstract/shape-abstract';
import { ModeType, PointType } from '../../assets/tool-constants';

@Component({
  selector: 'app-shape-toolbox',
  templateUrl: './shape-toolbox.component.html',
  styleUrls: ['./shape-toolbox.component.scss'],
})
export class ShapeToolboxComponent implements OnInit {

  mode = ModeType;
  point = PointType;
  @Input() canvas: CanvasComponent;

  constructor(protected toolHandler: ToolHandlerService) {
    // empty body
  }

  ngOnInit(): void {
    // empty body
  }

  getComponent(): LineAbstract {  // change to parent of shapeAbstract so only one toolbox component can be used for all tools
    return this.canvas.activeTool;
  }

}
