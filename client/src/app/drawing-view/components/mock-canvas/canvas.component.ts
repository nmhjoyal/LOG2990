import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { NewDrawingModalData } from '../NewDrawingModalData';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: NewDrawingModalData) {
  }

  ngOnInit() {
    // empty block
  }
}
