import { Injectable } from '@angular/core';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { IShape } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import { Id } from 'src/app/drawing-view/components/tools/assets/tool-constants';

@Injectable({
  providedIn: 'root'
})
export class DrawingStorageService {

  drawings: ITools[];
  selection: IShape;
  
  constructor() {
    this.drawings = [];
    this.selection = { x: 0, y: 0, width: 0, height: 0, primaryColor: 'black', secondaryColor: 'black',
    fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: Id.SELECTOR };
  }

  saveDrawing(drawing: ITools): void {
    this.drawings.push(drawing);
  }

  seeDrawings(): ITools[] {
    return this.drawings;
  }
  
  emptyDrawings(): void {
    this.drawings.length = 0;
  }

  resetSelectorBox(): void {
    this.selection = { x: 0, y: 0, width: 0, height: 0, primaryColor: 'black', secondaryColor: 'black',
    fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: Id.SELECTOR };
  }

  seeSelection(): IShape {
    return this.selection;
  }

  saveSelectorBox(shape: IShape): void {
    this.selection = { x: shape.x, y: shape.y, width: shape.width, height: shape.height, primaryColor: 'black', secondaryColor: 'black',
    fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: Id.SELECTOR };
  }

  selectorBoxExists(): boolean {
    return (this.selection.width > 0 && this.selection.height > 0);
  }
}
