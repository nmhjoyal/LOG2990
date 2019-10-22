import { Component, OnInit, Input } from '@angular/core';
import { Id } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import { IDrawing } from '../../../../../../../../../common/drawing-information/IDrawing';

@Component({
  selector: 'app-preview-canvas',
  templateUrl: './preview-canvas.component.html',
  styleUrls: ['./preview-canvas.component.scss']
})
export class PreviewCanvasComponent implements OnInit {

  @Input('display') previewedDrawing: IDrawing;
  toolId = Id;
  viewboxCoordinates: string;

  constructor() { 
    this.viewboxCoordinates = '';
  }

  ngOnInit() {
    this.viewboxCoordinates = '0 0 ' + 
    this.previewedDrawing.canvas.drawingWidth + ' ' + 
    this.previewedDrawing.canvas.drawingHeight;
  }
  

}
