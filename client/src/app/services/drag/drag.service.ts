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
    const gridSize = this.gridService.GridSize;
    const topCornerX = this.selectorService.topCornerX;
    const topCornerY = this.selectorService.topCornerY;
    switch (controlPoint) {
      case ControlPoints.TOP_LEFT:
        const gridXTopLeft = Math.round(cursorX / gridSize) * gridSize;
        const gridYTopLeft = Math.round(cursorY / gridSize) * gridSize;

        this.selectorService.selectedObjects.forEach((movedObject) => {
          const xDistToSelectorBox = movedObject.x - topCornerX;
          const yDistToSelectorBox = movedObject.y - topCornerY;
          if (movedObject.alignX) {
            movedObject.alignX = gridXTopLeft + xDistToSelectorBox;
          }
          movedObject.x = gridXTopLeft + xDistToSelectorBox;
          movedObject.y = gridYTopLeft + yDistToSelectorBox;
          ParserHelper.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, controlPoint, this.gridService);
        });
        break;
      case ControlPoints.TOP_MIDDLE:
        const gridXTopMiddle = Math.round(cursorX / gridSize) * gridSize
          - ((this.selectorService.MinWidth / 2) % gridSize);
        const gridYTopMiddle = Math.round(cursorY / gridSize) * gridSize;
        this.selectorService.selectedObjects.forEach((movedObject) => {

          const xDistToSelectorBox = movedObject.x - topCornerX;
          if (movedObject.alignX) {
            movedObject.alignX = gridXTopMiddle + xDistToSelectorBox;
          }
          movedObject.x = gridXTopMiddle + xDistToSelectorBox;

          const yDistToSelectorBox = movedObject.y - topCornerY;
          movedObject.y = gridYTopMiddle + yDistToSelectorBox;
          ParserHelper.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, controlPoint, this.gridService);
        });
        break;
      case ControlPoints.TOP_RIGHT:
        const gridXTopRight = Math.round(cursorX / gridSize) * gridSize - ((this.selectorService.MinWidth) % gridSize);
        const gridYTopRight = Math.round(cursorY / gridSize) * gridSize;

        this.selectorService.selectedObjects.forEach((movedObject) => {
          const xDistToSelectorBox = movedObject.x - topCornerX;
          if (movedObject.alignX) {
            movedObject.alignX = gridXTopRight + xDistToSelectorBox;
          }
          movedObject.x = gridXTopRight + xDistToSelectorBox;
          const yDistToSelectorBox = movedObject.y - topCornerY;
          movedObject.y = gridYTopRight + yDistToSelectorBox;
          ParserHelper.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, controlPoint, this.gridService);
        });
        break;
      case ControlPoints.MIDDLE_LEFT:
        const gridXMiddleLeft = Math.round(cursorX / gridSize) * gridSize;
        const gridYMiddleLeft = Math.round(cursorY / gridSize) * gridSize - ((this.selectorService.MinHeight / 2) % gridSize);
        this.selectorService.selectedObjects.forEach((movedObject) => {
          const xDistToSelectorBox = movedObject.x - topCornerX;
          if (movedObject.alignX) {
            movedObject.alignX = gridXMiddleLeft + xDistToSelectorBox;
          }
          movedObject.x = gridXMiddleLeft + xDistToSelectorBox;

          const yDistToSelectorBox = movedObject.y - topCornerY;
          movedObject.y = gridYMiddleLeft + yDistToSelectorBox;
          ParserHelper.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, controlPoint, this.gridService);
        });
        break;
      case ControlPoints.MIDDLE:
        const gridXMiddle = Math.round(cursorX / gridSize) * gridSize - ((this.selectorService.MinWidth / 2) % gridSize);
        const gridYMiddle = Math.round(cursorY / gridSize) * gridSize - ((this.selectorService.MinHeight / 2) % gridSize);
        this.selectorService.selectedObjects.forEach((movedObject) => {

          const xDistToSelectorBox = movedObject.x - topCornerX;
          if (movedObject.alignX) {
            movedObject.alignX = gridXMiddle + xDistToSelectorBox;
          }
          movedObject.x = gridXMiddle + xDistToSelectorBox;

          const yDistToSelectorBox = movedObject.y - topCornerY;
          movedObject.y = gridYMiddle + yDistToSelectorBox;
          ParserHelper.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, controlPoint, this.gridService);
        });
        break;
      case ControlPoints.MIDDLE_RIGHT:
        const gridXMiddleRight = Math.round(cursorX / gridSize) * gridSize - ((this.selectorService.MinWidth) % gridSize);
        const gridYMiddleRight = Math.round(cursorY / gridSize) * gridSize - ((this.selectorService.MinHeight / 2) % gridSize);
        this.selectorService.selectedObjects.forEach((movedObject) => {

          const xDistToSelectorBox = movedObject.x - topCornerX;
          if (movedObject.alignX) {
            movedObject.alignX = gridXMiddleRight + xDistToSelectorBox;
          }
          movedObject.x = gridXMiddleRight + xDistToSelectorBox;

          const yDistToSelectorBox = movedObject.y - topCornerY;
          movedObject.y = gridYMiddleRight + yDistToSelectorBox;
          ParserHelper.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, controlPoint, this.gridService);
        });
        break;
      case ControlPoints.BOTTOM_LEFT:
        const gridXBottomLeft = Math.round(cursorX / gridSize) * gridSize - gridSize / 2;
        const gridYBottomLeft = Math.round(cursorY / gridSize) * gridSize - ((this.selectorService.MinHeight) % gridSize);
        this.selectorService.selectedObjects.forEach((movedObject) => {
          const xDistToSelectorBox = movedObject.x - topCornerX;
          if (movedObject.alignX) {
            movedObject.alignX = gridXBottomLeft + xDistToSelectorBox;
          }
          movedObject.x = gridXBottomLeft + xDistToSelectorBox;
          const yDistToSelectorBox = movedObject.y - topCornerY;
          movedObject.y = gridYBottomLeft + yDistToSelectorBox;
          ParserHelper.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, controlPoint, this.gridService);
        });
        break;
      case ControlPoints.BOTTOM_MIDDLE:
        const gridXBottomMiddle = Math.round(cursorX / gridSize) * gridSize - ((this.selectorService.MinWidth / 2) % gridSize);
        const gridYBottomMiddle = Math.round(cursorY / gridSize) * gridSize - ((this.selectorService.MinHeight) % gridSize);
        this.selectorService.selectedObjects.forEach((movedObject) => {

          const xDistToSelectorBox = movedObject.x - topCornerX;
          if (movedObject.alignX) {
            movedObject.alignX = gridXBottomMiddle + xDistToSelectorBox;
          }
          movedObject.x = gridXBottomMiddle + xDistToSelectorBox;

          const yDistToSelectorBox = movedObject.y - topCornerY;
          movedObject.y = gridYBottomMiddle + yDistToSelectorBox;
          ParserHelper.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, controlPoint, this.gridService);
        });
        break;
      case ControlPoints.BOTTOM_RIGHT:
        const gridXBottomRight = Math.round(cursorX / gridSize) * gridSize - ((this.selectorService.MinWidth) % gridSize);
        const gridYBottomRight = Math.round(cursorY / gridSize) * gridSize - ((this.selectorService.MinHeight) % gridSize);
        this.selectorService.selectedObjects.forEach((movedObject) => {

          const xDistToSelectorBox = movedObject.x - topCornerX;
          if (movedObject.alignX) {
            movedObject.alignX = gridXBottomRight + xDistToSelectorBox;
          }
          movedObject.x = gridXBottomRight + xDistToSelectorBox;

          const yDistToSelectorBox = movedObject.y - topCornerY;
          movedObject.y = gridYBottomRight + yDistToSelectorBox;
          ParserHelper.snapPolylinePoints(cursorX, cursorY, movedObject, this.selectorService, controlPoint, this.gridService);
        });
        break;
      default:
        const gridX = Math.round(cursorX / gridSize) * gridSize;
        const gridY = Math.round(cursorY / gridSize) * gridSize;

        this.selectorService.selectedObjects.forEach((movedObject) => {
          const xDistToSelectorBox = movedObject.x - topCornerX;
          if (movedObject.alignX) {
            movedObject.alignX = gridX + xDistToSelectorBox;
          }
          movedObject.x = gridX + xDistToSelectorBox;
          const yDistToSelectorBox = movedObject.y - topCornerY;
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
