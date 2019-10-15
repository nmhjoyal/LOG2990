import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { INewDrawingModalData } from '../modal-windows/new-drawing-window/INewDrawingModalData';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent {

  constructor(@Inject(MAT_DIALOG_DATA) protected data: INewDrawingModalData) {
  }
}
