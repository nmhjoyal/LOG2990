import { Component, Inject, OnInit, ViewChild, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { NewDrawingModalData } from '../NewDrawingModalData';
import { ShapeAbstract } from '../tools/shapes/assets/shape-abstract';

@Component({
  selector: 'app-mock-canvas',
  templateUrl: './mock-canvas.component.html',
  styleUrls: ['./mock-canvas.component.scss'],
})
export class MockCanvasComponent implements OnInit {

  @ViewChild('activeTool', {static: false}) activeTool: ShapeAbstract; // put general tool abstract here

  constructor(@Inject(MAT_DIALOG_DATA) public data: NewDrawingModalData, public toolHandler: ToolHandlerService) {
    // empty body
  }

  ngOnInit() {
    // empty block
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: any): void {
    console.log(event);
  }

}
