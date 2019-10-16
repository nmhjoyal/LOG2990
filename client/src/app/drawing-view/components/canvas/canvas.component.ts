import { Component } from '@angular/core';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent {

  constructor(protected canvasData: CanvasInformationService) {
  }
}
