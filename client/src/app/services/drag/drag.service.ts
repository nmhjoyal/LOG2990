import { Injectable } from '@angular/core';
import { ControlPoints } from 'src/AppConstants/ControlPoints';
import { GridService } from '../grid/grid.service';
import { ParserService } from '../parser-service/parser.service';
import { SelectorService } from '../selector-service/selector-service';

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
        // let topSelectorX: number = this.selectorService.topCornerX;
        // let topSelectorY: number = this.selectorService.topCornerY;
        // this.selectorService.selectedObjects.forEach((movedObject) => {
        //   topSelectorX += Math.round((cursorX - this.selectorService.topCornerX) / this.gridService.GridSize) * this.gridService.GridSize;
        //   topSelectorY += Math.round((cursorY - this.selectorService.topCornerY) / this.gridService.GridSize) * this.gridService.GridSize;
        //   let distX = topSelectorX - movedObject.x;
        //   let distY = topSelectorY - movedObject.y;
        //   movedObject.x +=  distX
        //   movedObject.y +=  distY;
        // });
         this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX)
            / this.gridService.GridSize) * this.gridService.GridSize;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, ControlPoints.TOP_MIDDLE);
        });
        break;
      case ControlPoints.TOP_MIDDLE:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX )
            / this.gridService.GridSize) * this.gridService.GridSize - this.selectorService.MinWidth / 2;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, ControlPoints.TOP_MIDDLE);
        });
        break;
      case ControlPoints.TOP_RIGHT:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX)
            / this.gridService.GridSize) * this.gridService.GridSize  - this.selectorService.MinWidth;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, ControlPoints.TOP_RIGHT);
        });
        break;
      case ControlPoints.MIDDLE_LEFT:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX)
            / this.gridService.GridSize) * this.gridService.GridSize;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight / 2)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, ControlPoints.MIDDLE_LEFT);
        });
        break;
      case ControlPoints.MIDDLE:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth / 2)
            / this.gridService.GridSize) * this.gridService.GridSize;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight / 2)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, ControlPoints.MIDDLE);
        });
        break;
      case ControlPoints.MIDDLE_RIGHT:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth)
            / this.gridService.GridSize) * this.gridService.GridSize;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight / 2)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, ControlPoints.MIDDLE_RIGHT);
        });
        break;
      case ControlPoints.BOTTOM_LEFT:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX)
            / this.gridService.GridSize) * this.gridService.GridSize;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, ControlPoints.BOTTOM_LEFT);
        });
        break;
      case ControlPoints.BOTTOM_MIDDLE:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth / 2)
            / this.gridService.GridSize) * this.gridService.GridSize;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, ControlPoints.BOTTOM_MIDDLE);
        });
        break;
      case ControlPoints.BOTTOM_RIGHT:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth)
            / this.gridService.GridSize) * this.gridService.GridSize;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, ControlPoints.BOTTOM_RIGHT);
        });
        break;
      default:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          movedObject.x = Math.round((movedObject.x + cursorX - this.selectorService.topCornerX)
            / this.gridService.GridSize) * this.gridService.GridSize;
          movedObject.y = Math.round((movedObject.y + cursorY - this.selectorService.topCornerY)
            / this.gridService.GridSize) * this.gridService.GridSize;
          this.parserService.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, ControlPoints.TOP_LEFT);
        });
        break;
    }
    this.selectorService.recalculateShape(windowWidth, windowHeight);
  }

  toggleSnapping(): void {
    this.shouldSnap = !this.shouldSnap;
  }
}
