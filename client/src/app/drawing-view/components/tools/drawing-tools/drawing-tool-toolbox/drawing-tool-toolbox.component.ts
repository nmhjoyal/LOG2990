import { Component, Input, OnInit } from '@angular/core';
import { DrawingToolsAbstract } from '../drawing-tools-abstract';

@Component({
  selector: 'app-drawing-tool-toolbox',
  templateUrl: './drawing-tool-toolbox.component.html',
  styleUrls: ['./drawing-tool-toolbox.component.scss'],
})
export class DrawingToolToolboxComponent implements OnInit {

  @Input() drawingToolComponent: DrawingToolsAbstract;

  constructor() { 
    // empty block
  }

  ngOnInit() {
    // empty block
  }

  getComponent() {
    return this.drawingToolComponent;
  }

}
