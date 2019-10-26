import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Gridservice {

  i = 1;
  status = ['visible', 'hidden'];
  pathString: string;

  // strings received from app component (user input)

  canvasStyleString: string;
  canvasSizeString: string;

  toggleGrid(): void {
    this.i = 1 - this.i;
  }

  setGridSize(): string {
    this.pathString = 'M' + this.canvasSizeString + ',0 L0,0 0,' + this.canvasSizeString;
    console.log(this.pathString);
    return this.pathString;
  }
}
