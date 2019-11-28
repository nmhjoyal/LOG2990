import { Injectable } from '@angular/core';
import { GridService } from '../grid/grid.service';
import { ParserService } from '../parser-service/parser.service';
import { SelectorService } from '../selector-service/selector-service';

@Injectable({
  providedIn: 'root',
})
export class DragService {
  shouldSnap: boolean;

  constructor(public selectorService: SelectorService, public gridService: GridService, public parserService: ParserService): void { }

  dragObjects(cursorX: number, cursorY: number, windowWidth: number, windowHeight: number): void {
    this.selectorService.selectedObjects.forEach((movedObject) => {
      movedObject.x += cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth / 2;
      movedObject.y += cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight / 2;
      this.parserService.dragPolylinePoints(cursorX, cursorY, movedObject, this.selectorService);
    });
    this.selectorService.recalculateShape(windowWidth, windowHeight);
  }

  snapObjects(cursorX: number, cursorY: number, windowWidth: number, windowHeight: number): void {
    this.selectorService.selectedObjects.forEach((movedObject) => {
      movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth / 2) / this.gridService.GridSize)
        * this.gridService.GridSize;
      movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight / 2) / this.gridService.GridSize)
        * this.gridService.GridSize;
      this.parserService.dragPolylinePoints(cursorX, cursorY, movedObject, this.selectorService);
    });
    this.selectorService.recalculateShape(windowWidth, windowHeight);
  }

  toggleSnapping(): void {

  }
}
