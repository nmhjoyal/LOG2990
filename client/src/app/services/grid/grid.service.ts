import { Injectable } from '@angular/core';
import { NumericalValues } from 'src/AppConstants/NumericalValues';

@Injectable({
  providedIn: 'root',
})

export class Gridservice {

  gridStatus: boolean;
  gridOpacity: number;
  gridSize: number;

  constructor() {
    this.gridStatus = false;
    this.gridOpacity = NumericalValues.DEFAULT_OPACITY;
   this.gridSize =  NumericalValues.DEFAULT_GRID_SIZE;
  }

  toggleGrid(): void {
    this.gridStatus = !this.gridStatus;
    this.setGrid();
  }

  setGrid(): void {
    if (this.gridStatus) {
      this.gridOpacity = this.gridOpacity;
    } else {
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
