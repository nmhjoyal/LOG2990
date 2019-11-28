import { Injectable } from '@angular/core';
import { GridService } from '../grid/grid.service';
import { ParserService } from '../parser-service/parser.service';
import { SelectorService } from '../selector-service/selector-service';

@Injectable({
  providedIn: 'root',
})
export class DragService {

  constructor(public selectorService: SelectorService, public gridService: GridService, public parserService: ParserService) { }

  dragObjects(cursorX: number, cursorY: number, windowWidth: number, windowHeight: number): void {
    this.selectorService.selectedObjects.forEach((movedObject) => {
      movedObject.x += movedObject.x % this.gridService.GridSize < this.gridService.GridSize / 2 ?
        Math.round((cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth / 2) / this.gridService.GridSize)
        * this.gridService.GridSize
        : Math.round((cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth / 2) / this.gridService.GridSize)
        * this.gridService.GridSize;
      movedObject.y += movedObject.y % this.gridService.GridSize > this.gridService.GridSize / 2 ?
        Math.round((cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight / 2) / this.gridService.GridSize)
        * this.gridService.GridSize
        : Math.round((cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight / 2) / this.gridService.GridSize)
        * this.gridService.GridSize;
      this.parserService.dragPolylinePoints(cursorX, cursorY, movedObject, this.selectorService);
    });
    this.selectorService.recalculateShape(windowWidth, windowHeight);
  }
}
