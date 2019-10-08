import { Component, Input, OnInit } from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ShapeAbstract } from '../assets/shape-abstract';

@Component({
  selector: 'app-shape-toolbox',
  templateUrl: './shape-toolbox.component.html',
  styleUrls: ['./shape-toolbox.component.scss'],
})
export class ShapeToolboxComponent implements OnInit {

  @Input() drawing: ShapeAbstract;

  constructor(protected toolHandler: ToolHandlerService) {
    // empty body
  }

  ngOnInit(): void {
    // empty body
  }

  getComponent(): ShapeAbstract {
    return this.drawing;
  }

}
