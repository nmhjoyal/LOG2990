import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { NewDrawingModalData } from '../NewDrawingModalData';
import { Id } from '../tools/assets/tool-constants';
import { DrawingToolsAbstract } from '../tools/drawing-tools/drawing-tools-abstract';

@Component({
  selector: 'app-mock-canvas',
  templateUrl: './mock-canvas.component.html',
  styleUrls: ['./mock-canvas.component.scss'],
})
export class MockCanvasComponent implements OnInit {

  toolID = Id;
  @ViewChild('activeTool', {static: false}) activeTool: DrawingToolsAbstract; // put general tool abstract here

  constructor(@Inject(MAT_DIALOG_DATA) public data: NewDrawingModalData, protected storage: ToolHandlerService) {
    // empty body
  }

  ngOnInit() {
    // empty block
  }

}
