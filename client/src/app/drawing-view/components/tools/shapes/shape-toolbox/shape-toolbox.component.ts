import { Component, Input, OnInit } from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { CanvasComponent } from '../../../canvas/canvas.component';
import { ModeType } from '../../assets/tool-constants';
import { ToolAbstract } from '../../assets/abstracts/tool-abstract/tool-abstract';

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

  getComponent(): ToolAbstract {
    return this.canvas.activeTool;
  }

}
