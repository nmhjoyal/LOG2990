import { Injectable } from '@angular/core';
import { GridService } from '../grid/grid.service';
import { SelectorService } from '../selector-service/selector-service';
import { ParserService } from '../parser-service/parser.service';
import { ControlPoints } from 'src/AppConstants/ControlPoints';

@Injectable({
  providedIn: 'root',
})
export class DragService {
  shouldSnap: boolean;

  constructor(public selectorService: SelectorService, public gridService: GridService, public parserService: ParserService) { }

  dragObjects(cursorX: number, cursorY: number, windowWidth: number, windowHeight: number): void {
    this.selectorService.selectedObjects.forEach((movedObject) => {
      movedObject.x += cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth / 2;
      movedObject.y += cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight / 2;
      this.parserService.dragPolylinePoints(cursorX, cursorY, movedObject, this.selectorService);
    });
    this.selectorService.recalculateShape(windowWidth, windowHeight);
  }

  snapObjects(cursorX: number, cursorY: number, windowWidth: number, windowHeight: number, controlPoint: ControlPoints): void {
    switch (controlPoint) {
      case ControlPoints.TOP_LEFT:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX)
            / this.gridService.GridSize) * this.gridService.GridSize;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.dragPolylinePoints(cursorX, cursorY, movedObject, this.selectorService);
        });
        break;
      case ControlPoints.TOP_MIDDLE:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth / 2)
            / this.gridService.GridSize) * this.gridService.GridSize;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.dragPolylinePoints(cursorX, cursorY, movedObject, this.selectorService);
        });
        break;
      case ControlPoints.TOP_RIGHT:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth)
            / this.gridService.GridSize) * this.gridService.GridSize;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.dragPolylinePoints(cursorX, cursorY, movedObject, this.selectorService);
        });
        break;
      case ControlPoints.MIDDLE_LEFT:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX)
            / this.gridService.GridSize) * this.gridService.GridSize;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight / 2)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.dragPolylinePoints(cursorX, cursorY, movedObject, this.selectorService);
        });
        break;
      case ControlPoints.MIDDLE:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth / 2)
            / this.gridService.GridSize) * this.gridService.GridSize;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight / 2)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.dragPolylinePoints(cursorX, cursorY, movedObject, this.selectorService);
        });
        break;
      case ControlPoints.MIDDLE_RIGHT:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth)
            / this.gridService.GridSize) * this.gridService.GridSize;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight / 2)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.dragPolylinePoints(cursorX, cursorY, movedObject, this.selectorService);
        });
        break;
      case ControlPoints.BOTTOM_LEFT:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX)
            / this.gridService.GridSize) * this.gridService.GridSize;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.dragPolylinePoints(cursorX, cursorY, movedObject, this.selectorService);
        });
        break;
      case ControlPoints.BOTTOM_MIDDLE:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth / 2)
            / this.gridService.GridSize) * this.gridService.GridSize;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.dragPolylinePoints(cursorX, cursorY, movedObject, this.selectorService);
        });
        break;
      case ControlPoints.BOTTOM_RIGHT:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth)
            / this.gridService.GridSize) * this.gridService.GridSize;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.dragPolylinePoints(cursorX, cursorY, movedObject, this.selectorService);
        });
        break;
      default:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth / 2)
            / this.gridService.GridSize) * this.gridService.GridSize;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight / 2)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.dragPolylinePoints(cursorX, cursorY, movedObject, this.selectorService);
        });
        break;
    }
    this.selectorService.recalculateShape(windowWidth, windowHeight);
  }

  toggleSnapping(): void {
    this.shouldSnap = !this.shouldSnap;
  }
}
