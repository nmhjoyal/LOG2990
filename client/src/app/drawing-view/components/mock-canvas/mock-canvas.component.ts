import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { NewDrawingModalData } from '../NewDrawingModalData';

@Component({
  selector: 'app-mock-canvas',
  templateUrl: './mock-canvas.component.html',
  styleUrls: ['./mock-canvas.component.scss'],
})
export class MockCanvasComponent implements OnInit {

  private rectangles: { x: number;
                         y: number;
                         width: number;
                         height: number;
                         primeColor: string;
                         secondColor: string;
                         strokeOpacity: number;
                         strokeWidth: number;
                         fillOpacity: number; }[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: NewDrawingModalData, private storage: LocalStorageService) {
    this.rectangles = this.storage.rectangles;
  }

  ngOnInit() {
    // empty block
  }

  get drawnRectangles(): { x: number; y: number; width: number; height: number;
                          primeColor: string; secondColor: string; strokeOpacity: number;
                          strokeWidth: number; fillOpacity: number; }[] {
     return this.rectangles;
    }

}
