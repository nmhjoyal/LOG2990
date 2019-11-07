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
    this.gridOpacity = 1;
    this.gridSize = 1;
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

// Functional but code smell size setter
/*
  setSizeSmell(): void {
    const gridElement = document.getElementById('smallGrid');
    const pathElement = document.getElementById('myPath');
    const value = (document.getElementById('sizeInput') as HTMLInputElement).value;
    const pathValue = 'M' + value + ',0 L0,0 0,' + value;

    if (gridElement && pathElement) {
      pathElement.setAttribute('d', pathValue);
      gridElement.setAttribute('width', value);
      gridElement.setAttribute('height', value);
    }

  }*/

  decreaseSize(): void {
    if (this.gridSize > NumericalValues.MIN_GRID_SIZE) {
      this.gridSize--;
      }
  }

  increaseSize(): void {
    if (this.gridSize < NumericalValues.MAX_GRID_SIZE) {
      this.gridSize++;
      }
  }

}
