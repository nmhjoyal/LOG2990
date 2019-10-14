import { Component, Input, OnInit } from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ShapeAbstract } from '../../assets/abstracts/shape-abstract/shape-abstract';
import { ModeType } from '../../assets/tool-constants';
import { CanvasComponent } from '../../../canvas/canvas.component';

@Component({
  selector: 'app-shape-toolbox',
  templateUrl: './shape-toolbox.component.html',
  styleUrls: ['./shape-toolbox.component.scss'],
})
export class ShapeToolboxComponent implements OnInit {

  mode = ModeType;
  @Input() canvas: CanvasComponent;

  constructor(protected toolHandler: ToolHandlerService) {
    // empty body
  }

  ngOnInit(): void {
    // empty body
  }

  getComponent(): ShapeAbstract {  // change to parent of shapeAbstract so only one toolbox component can be used for all tools
    return this.canvas.activeTool;
  }

}
