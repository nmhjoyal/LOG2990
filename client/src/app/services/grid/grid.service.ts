import { Injectable } from '@angular/core';
import { NumericalValues } from 'src/AppConstants/NumericalValues';

@Injectable({
  providedIn: 'root',
})

export class Gridservice {

  gridStatus: boolean;
  gridOpacity: number;
  lastOpacity: number;
  gridSize: number;

  constructor() {
    this.gridStatus = false;
    this.gridOpacity = 0;
    this.gridSize =  NumericalValues.DEFAULT_GRID_SIZE;
    this.lastOpacity = NumericalValues.DEFAULT_OPACITY;
  }

  toggleGrid(): void {
    this.gridStatus = !this.gridStatus;
    if (this.gridStatus) {
      this.gridOpacity = this.lastOpacity;
    } else {
      this.lastOpacity = this.gridOpacity;
      this.gridOpacity = 0;
    }
  }

  decreaseSize(): void {
    if (this.gridSize > NumericalValues.MIN_GRID_SIZE) {
      this.gridSize -= NumericalValues.GRID_SIZE_STEP;
      }
  }

  increaseSize(): void {
    if (this.gridSize < NumericalValues.MAX_GRID_SIZE) {
      this.gridSize += NumericalValues.GRID_SIZE_STEP;
      }
  }

}
