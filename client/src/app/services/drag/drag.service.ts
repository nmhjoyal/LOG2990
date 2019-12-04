import { Injectable } from '@angular/core';
import { ControlPoints } from 'src/AppConstants/ControlPoints';
import { GridService } from '../grid/grid.service';
import ParserHelper from '../parser-service/parser.service';
import { SelectorService } from '../selector-service/selector-service';

@Injectable({
  providedIn: 'root',
})
export class DragService {
  shouldSnap: boolean;

  constructor(public selectorService: SelectorService, public gridService: GridService) { }

  dragObjects(cursorX: number, cursorY: number, windowWidth: number, windowHeight: number): void {
    this.selectorService.selectedObjects.forEach((movedObject) => {
      if (movedObject.alignX) {
        movedObject.alignX += (cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth / 2);
      } else if (movedObject.sprays) {
        movedObject.sprays.forEach((spray) => {
          spray.cx += (cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth / 2);
          spray.cy += (cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight / 2);
        });
      }
      movedObject.x += (cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth / 2);
      movedObject.y += (cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight / 2);
      ParserHelper.dragPolylinePoints(cursorX, cursorY, movedObject, this.selectorService);
    });
    this.selectorService.recalculateShape(windowWidth, windowHeight);

  }

  snapObjects(cursorX: number, cursorY: number, windowWidth: number, windowHeight: number, controlPoint: ControlPoints): void {
    switch (controlPoint) {
      case ControlPoints.TOP_LEFT:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize;
          const xDistToSelectorBox = movedObject.x - this.selectorService.topCornerX;
          if (movedObject.alignX) {
            movedObject.alignX = gridX + xDistToSelectorBox;
          }
          movedObject.x = gridX + xDistToSelectorBox;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize;
          const yDistToSelectorBox = movedObject.y - this.selectorService.topCornerY;
          movedObject.y = gridY + yDistToSelectorBox;
          ParserHelper.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, controlPoint, this.gridService);
        });
        break;
      case ControlPoints.TOP_MIDDLE:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize
            - ((this.selectorService.MinWidth / 2) % this.gridService.GridSize);
          const xDistToSelectorBox = movedObject.x - this.selectorService.topCornerX;
          if (movedObject.alignX) {
            movedObject.alignX = gridX + xDistToSelectorBox;
          }
          movedObject.x = gridX + xDistToSelectorBox;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize;
          const yDistToSelectorBox = movedObject.y - this.selectorService.topCornerY;
          movedObject.y = gridY + yDistToSelectorBox;
          ParserHelper.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, controlPoint, this.gridService);
        });
        break;
      case ControlPoints.TOP_RIGHT:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize
            - ((this.selectorService.MinWidth) % this.gridService.GridSize);
          const xDistToSelectorBox = movedObject.x - this.selectorService.topCornerX;
          if (movedObject.alignX) {
            movedObject.alignX = gridX + xDistToSelectorBox;
          }
          movedObject.x = gridX + xDistToSelectorBox;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize;
          const yDistToSelectorBox = movedObject.y - this.selectorService.topCornerY;
          movedObject.y = gridY + yDistToSelectorBox;
          ParserHelper.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, controlPoint, this.gridService);
        });
        break;
      case ControlPoints.MIDDLE_LEFT:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize;
          const xDistToSelectorBox = movedObject.x - this.selectorService.topCornerX;
          if (movedObject.alignX) {
            movedObject.alignX = gridX + xDistToSelectorBox;
          }
          movedObject.x = gridX + xDistToSelectorBox;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize
            - ((this.selectorService.MinHeight / 2) % this.gridService.GridSize);
          const yDistToSelectorBox = movedObject.y - this.selectorService.topCornerY;
          movedObject.y = gridY + yDistToSelectorBox;
          ParserHelper.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, controlPoint, this.gridService);
        });
        break;
      case ControlPoints.MIDDLE:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize
            - ((this.selectorService.MinWidth / 2) % this.gridService.GridSize);
          const xDistToSelectorBox = movedObject.x - this.selectorService.topCornerX;
          if (movedObject.alignX) {
            movedObject.alignX = gridX + xDistToSelectorBox;
          }
          movedObject.x = gridX + xDistToSelectorBox;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize
            - ((this.selectorService.MinHeight / 2) % this.gridService.GridSize);
          const yDistToSelectorBox = movedObject.y - this.selectorService.topCornerY;
          movedObject.y = gridY + yDistToSelectorBox;
          ParserHelper.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, controlPoint, this.gridService);
        });
        break;
      case ControlPoints.MIDDLE_RIGHT:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize
            - ((this.selectorService.MinWidth) % this.gridService.GridSize);
          const xDistToSelectorBox = movedObject.x - this.selectorService.topCornerX;
          if (movedObject.alignX) {
            movedObject.alignX = gridX + xDistToSelectorBox;
          }
          movedObject.x = gridX + xDistToSelectorBox;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize
            - ((this.selectorService.MinHeight / 2) % this.gridService.GridSize);
          const yDistToSelectorBox = movedObject.y - this.selectorService.topCornerY;
          movedObject.y = gridY + yDistToSelectorBox;
          ParserHelper.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, controlPoint, this.gridService);
        });
        break;
      case ControlPoints.BOTTOM_LEFT:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize - this.gridService.GridSize / 2;
          const xDistToSelectorBox = movedObject.x - this.selectorService.topCornerX;
          if (movedObject.alignX) {
            movedObject.alignX = gridX + xDistToSelectorBox;
          }
          movedObject.x = gridX + xDistToSelectorBox;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize
            - ((this.selectorService.MinHeight) % this.gridService.GridSize);
          const yDistToSelectorBox = movedObject.y - this.selectorService.topCornerY;
          movedObject.y = gridY + yDistToSelectorBox;
          ParserHelper.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, controlPoint, this.gridService);
        });
        break;
      case ControlPoints.BOTTOM_MIDDLE:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize
            - ((this.selectorService.MinWidth / 2) % this.gridService.GridSize);
          const xDistToSelectorBox = movedObject.x - this.selectorService.topCornerX;
          if (movedObject.alignX) {
            movedObject.alignX = gridX + xDistToSelectorBox;
          }
          movedObject.x = gridX + xDistToSelectorBox;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize
            - ((this.selectorService.MinHeight) % this.gridService.GridSize);
          const yDistToSelectorBox = movedObject.y - this.selectorService.topCornerY;
          movedObject.y = gridY + yDistToSelectorBox;
          ParserHelper.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, controlPoint, this.gridService);
        });
        break;
      case ControlPoints.BOTTOM_RIGHT:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize
            - ((this.selectorService.MinWidth) % this.gridService.GridSize);
          const xDistToSelectorBox = movedObject.x - this.selectorService.topCornerX;
          if (movedObject.alignX) {
            movedObject.alignX = gridX + xDistToSelectorBox;
          }
          movedObject.x = gridX + xDistToSelectorBox;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize
            - ((this.selectorService.MinHeight) % this.gridService.GridSize);
          const yDistToSelectorBox = movedObject.y - this.selectorService.topCornerY;
          movedObject.y = gridY + yDistToSelectorBox;
          ParserHelper.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, controlPoint, this.gridService);
        });
        break;
      default:
        this.selectorService.selectedObjects.forEach((movedObject) => {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize;
          const xDistToSelectorBox = movedObject.x - this.selectorService.topCornerX;
          if (movedObject.alignX) {
            movedObject.alignX = gridX + xDistToSelectorBox;
          }
          movedObject.x = gridX + xDistToSelectorBox;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize;
          const yDistToSelectorBox = movedObject.y - this.selectorService.topCornerY;
          movedObject.y = gridY + yDistToSelectorBox;
          ParserHelper.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, controlPoint, this.gridService);
        });
        break;
    }
    this.selectorService.recalculateShape(windowWidth, windowHeight);
  }

  toggleSnapping(): void {
    this.shouldSnap = !this.shouldSnap;
  }
}
