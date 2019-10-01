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

    private lines:    { points: string;
                        color: string; 
                        strokeWidth: number; 
                        fill:string; 
                        strokeLinecap:string; 
                        filter:string; }[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: NewDrawingModalData, private storage: LocalStorageService) {
    this.rectangles = this.storage.rectangles;
    this.lines = storage.lines;
  }

  ngOnInit() {
    // empty block
    console.log(this.rectangles);
    console.log(this.storage);
  }

  applyColourToLine(line: { points: string;
    color: string,
    strokeWidth: number,
    fill: string,
    strokeLinecap: string,
    filter: string, }): void {
    if (this.storage.isColourApplicatorSelected()) {
      line.fill = this.storage.primaryColor;
    }
  }

  applyColour(rectangle: {
    x: number;
    y: number;
    width: number;
    height: number;
    primeColor: string;
    secondColor: string;
    strokeOpacity: number;
    strokeWidth: number;
    fillOpacity: number; }): void {
    if (this.storage.isColourApplicatorSelected()) {
      rectangle.primeColor = this.storage.primaryColor;
    }
  }

  applySecondaryColour(event: MouseEvent, rectangle: {
    x: number;
    y: number;
    width: number;
    height: number;
    primeColor: string;
    secondColor: string;
    strokeOpacity: number;
    strokeWidth: number;
    fillOpacity: number; }): void {
    if (this.storage.isColourApplicatorSelected()) {
      event.preventDefault();
      rectangle.secondColor = this.storage.secondaryColor;
    }
  }



  get drawnRectangles(): { x: number; y: number; width: number; height: number;
                          primeColor: string; secondColor: string; strokeOpacity: number;
                          strokeWidth: number; fillOpacity: number; }[] {
    return this.rectangles;
  }
  get drawnLines(): { points: string; color: string; strokeWidth: number; 
                      fill:string; strokeLinecap:string; filter:string; }[] {
    return this.lines;
  }

}
