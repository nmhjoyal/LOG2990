import { Injectable } from '@angular/core';
import { GridConstants } from '../../drawing-view/components/tools/assets/constants/grid-constants';

@Injectable({
  providedIn: 'root',
})

export class GridService {

  private gridStatus: boolean;
  protected gridOpacity: number;
  protected lastOpacity: number;
  protected gridSize: number;

  constructor() {
    this.gridStatus = false;
    this.gridOpacity = 0;
    this.gridSize =  GridConstants.DEFAULT_GRID_SIZE;
    this.lastOpacity = GridConstants.DEFAULT_OPACITY;
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
    if (this.gridSize > GridConstants.MIN_GRID_SIZE) {
      this.gridSize -= GridConstants.GRID_SIZE_STEP;
      }
  }

  increaseSize(): void {
    if (this.gridSize < GridConstants.MAX_GRID_SIZE) {
      this.gridSize += GridConstants.GRID_SIZE_STEP;
      }
  }

}
