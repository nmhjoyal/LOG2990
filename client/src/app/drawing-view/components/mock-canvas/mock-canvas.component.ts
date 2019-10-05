import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { NewDrawingModalData } from '../NewDrawingModalData';

@Component({
  selector: 'app-mock-canvas',
  templateUrl: './mock-canvas.component.html',
  styleUrls: ['./mock-canvas.component.scss'],
})
export class MockCanvasComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: NewDrawingModalData) {
  }

  ngOnInit(): void {
    // empty block
  }
}
