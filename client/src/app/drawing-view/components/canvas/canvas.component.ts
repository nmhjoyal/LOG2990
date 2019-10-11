import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { NewDrawingModalData } from '../NewDrawingModalData';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {

  i = 0;

  constructor(@Inject(MAT_DIALOG_DATA) protected data: NewDrawingModalData) {
  }

  ngOnInit() {
    // empty block
  }

  toggleGrid(): void {
    this.i = 1 - this.i;
    const status = ['visible', 'hidden'];
    document.getElementById('myGrid').style.visibility = status[this.i];    // A changer
    console.log(this.i);
  }

  setOpacity(value: number): void {
    document.getElementById('myGrid').style.opacity = value;                // A changer
  }

}