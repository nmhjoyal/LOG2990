import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { NewDrawingModalData } from '../NewDrawingModalData';
import { DrawingToolsAbstract } from '../tools/assets/drawing-tools-abstract';
import { Id } from '../tools/assets/tool-constants';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {

  toolID = Id;
  @ViewChild('activeTool', {static: false}) activeTool: DrawingToolsAbstract; // put general tool abstract here

  constructor(@Inject(MAT_DIALOG_DATA) protected data: NewDrawingModalData, protected storage: ToolHandlerService) {
    // empty body
  }

  ngOnInit() {
    // empty block
  }

}
