import { Injectable } from '@angular/core';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { IPreviewBox } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import { Id } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
// tslint:disable-next-line: no-implicit-dependencies
import * as svgIntersections from 'svg-intersections';
import { ToolHandlerService } from '../tool-handler/tool-handler.service';

@Injectable({
  providedIn: 'root',
})

export class SelectorService {
  selectedObjects: Set<ITools>;
  clipboard: Set<ITools>;
  topCornerX: number;
  topCornerY: number;
  furthestX: number;
  fursthestY: number;
  pasteOffset: number;
  lastCursorX: number;
  lastCursorY: number;
  offScreen: boolean;

  constructor(protected toolService: ToolHandlerService) {
    this.selectedObjects = new Set<ITools>();
    this.clipboard = new Set<ITools>();
    this.topCornerX = 0;
    this.topCornerY = 0;
    this.furthestX = 0;
    this.fursthestY = 0;
    this.pasteOffset = 0;
    this.lastCursorX = 0;
    this.lastCursorY = 0;
  }

  copy(): void {
    this.clipboard.clear();
    if (this.selectedObjects) {
        this.selectedObjects.forEach((selectedObject) => {
          this.clipboard.add({...selectedObject});
      });
    }
  }

  paste(cursorX: number, cursorY: number): void {
    if (this.clipboard.size) {
      if (cursorX === this.lastCursorX && cursorY === this.lastCursorY) {
        this.pasteOffset = + 20;
      } else { this.pasteOffset = 0; }
      this.clipboard.forEach((copiedObject) => {
        copiedObject.x += cursorX - this.topCornerX -  this.MinWidth / 2 + this.pasteOffset;
        copiedObject.y += cursorY - this.topCornerY - this.MinHeight / 2 + this.pasteOffset;
        if ((copiedObject.x + this.MinWidth) > window.innerWidth || (copiedObject.y + this.MinHeight) > window.innerHeight) {
          copiedObject.x -= this.pasteOffset;
          copiedObject.y -= this.pasteOffset;
          this.pasteOffset = 0;
        }
        this.parsePolylinePoints(cursorX, cursorY, copiedObject);
        this.toolService.drawings.push({...copiedObject});
        this.SelectedObjects.clear();
        this.setBoxToDrawing(copiedObject);
      });
      this.lastCursorX = cursorX;
      this.lastCursorY = cursorY;
    }
  }

  parsePolylinePoints(cursorX: number, cursorY: number, copiedObject: ITools): void {
    if (copiedObject.points) {
      const splitPoints = copiedObject.points.split(/[ ,]+/).filter(Boolean);
      let newPoints = '';
      for (let i = 0; i < splitPoints.length; i += 2 ) {
        newPoints += (parseInt(splitPoints[i], 10) + cursorX  - this.topCornerX -  this.MinWidth / 2 + this.pasteOffset).toString();
        newPoints += ',';
        newPoints += (parseInt(splitPoints[i + 1], 10) + cursorY - this.topCornerY - this.MinHeight / 2 + this.pasteOffset).toString();
        newPoints += ' ';
      }
      copiedObject.points = newPoints;
    }
    if (copiedObject.vertices) {
      const splitPoints = copiedObject.vertices.split(/[ ,]+/).filter(Boolean);
      let newPoints = '';
      for (let i = 0; i < splitPoints.length; i += 2 ) {
        newPoints += (parseInt(splitPoints[i], 10) + cursorX  - this.topCornerX -  this.MinWidth / 2 + this.pasteOffset).toString();
        newPoints += ',';
        newPoints += (parseInt(splitPoints[i + 1], 10) + cursorY - this.topCornerY - this.MinHeight / 2 + this.pasteOffset).toString();
        newPoints += ' ';
      }
      copiedObject.vertices = newPoints;
    }
  }

  cut(): void {
    this.copy();
    this.delete();
  }

  duplicate(): void {
    this.copy();
    this.SelectedObjects.forEach((selectedObject) => {
      this.paste(selectedObject.height + 20, selectedObject.width + 20 );/*
      const copiedObject: ITools = selectedObject;
      if (copiedObject.x + copiedObject.width > window.innerWidth || copiedObject.y + copiedObject.height > window.innerHeight ) {
        copiedObject.x -= this.pasteOffset;
        copiedObject.y -= this.pasteOffset;
      } else {
        copiedObject.x += this.pasteOffset;
        copiedObject.y += this.pasteOffset;
      }
      this.toolService.drawings.push({...copiedObject});*/
    });
  }

  delete(): void {
    this.selectedObjects.forEach((element) => {
      const index = this.toolService.drawings.indexOf(element);
      if (index !== - 1) {
        this.toolService.drawings.splice(index, 1);
       }
    });
    this.resetSelectorService();
    this.selectedObjects.clear();
  }

  get MinWidth(): number {
    return Math.abs(this.furthestX - this.topCornerX);
  }

  get MinHeight(): number {
    return Math.abs(this.fursthestY - this.topCornerY);
  }

  get SelectedObjects(): Set<ITools> {
    return this.selectedObjects;
  }

  setBoxToDrawing(drawing: ITools): void {
    let x: number = drawing.x;
    let y: number = drawing.y;
    let width: number = drawing.width;
    let height: number = drawing.height;
    if (drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON) {
      x = drawing.x - drawing.width;
      y = drawing.y - drawing.height;
      width = drawing.width * NumericalValues.TWO;
      height = drawing.height * NumericalValues.TWO;
    }
    this.topCornerX = x;
    this.topCornerY = y;
    this.furthestX = x + width;
    this.fursthestY = y + height;
  }

  checkForItems(isReverseSelection: boolean, drawings: ITools[], previewBox: IPreviewBox): void {
    if (!isReverseSelection) {
      this.selectedObjects.clear();
    }
    for (const drawing of drawings) {
      if (this.objectInBox(drawing, previewBox)) {
        if (isReverseSelection) {
            this.selectedObjects.delete(drawing);
        } else {
          this.selectedObjects.add(drawing);
        }
        this.updateSelectorShape(drawing);
      }
    }
  }

  updateCorners(cursorX: number, initialX: number, cursorY: number, initialY: number, previewBoxX: number, previewBoxY: number): void {
    const bottomCornerX = cursorX >= initialX ? cursorX : initialX;
    const bottomCornerY = cursorY >= initialY ? cursorY : initialY;
    this.topCornerX = previewBoxX + bottomCornerX;
    this.topCornerY = previewBoxY + bottomCornerY;
  }

  updateSelectorShape(drawing: ITools): void {
    let x: number = drawing.x;
    let y: number = drawing.y;
    let width: number = drawing.width;
    let height: number = drawing.height;
    if (drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON) {
      x = drawing.x - drawing.width;
      y = drawing.y - drawing.height;
      width = drawing.width * NumericalValues.TWO;
      height = drawing.height * NumericalValues.TWO;
    }
    this.topCornerX = x < this.topCornerX ? x : this.topCornerX;
    this.topCornerY = y < this.topCornerY ? y : this.topCornerY;
    this.furthestX = this.furthestX < (x + width) ? (x + width) : this.furthestX;
    this.fursthestY = this.fursthestY < (y + height) ? (y + height) : this.fursthestY;
  }

  recalculateShape(windowWidth: number, windowHeight: number): void {
    this.topCornerX = windowWidth;
    this.topCornerY = windowHeight;
    this.furthestX = 0;
    this.fursthestY = 0;
    for (const object of this.selectedObjects) {
      this.updateSelectorShape(object);
    }
  }

  resetSize(): void {
    this.furthestX = 0;
    this.fursthestY = 0;
  }

  resetSelectorService(): void {
    this.selectedObjects.clear();
    this.resetSize();
    this.topCornerX = 0;
    this.topCornerY = 0;
  }

  cursorTouchesObject(object: ITools, positionX: number, positionY: number): boolean {
    let intersectionPoints = [];
    let coordinates = String(positionX) + ',' + String(positionY);
    coordinates += ' ' + String(positionX + 1) + ',' + String(positionY);
    coordinates += ' ' + String(positionX) + ',' + String(positionY + 1);
    coordinates += ' ' + String(positionX + 1) + ',' + String(positionY + 1);
    const selectorLine = { points: coordinates };
    let cursorInObject = false;
    switch (object.id) {
      case (Id.RECTANGLE):
        const rectIntersections = svgIntersections.intersect(svgIntersections.shape('rect', { x: object.x, y: object.y, width: object.width,
          height: object.height}),
          svgIntersections.shape('polyline', selectorLine));
        intersectionPoints = rectIntersections.points;
        cursorInObject = (object.x <= positionX && object.y <= positionY && (object.x + object.width) >= positionX &&
            (object.y + object.height) >= positionY);
        break;
      case Id.CRAYON: case Id.PAINTBRUSH: case Id.LINE:
        const lineIntersections = svgIntersections.intersect(svgIntersections.shape('polyline', { points: object.points }),
          svgIntersections.shape('polyline', selectorLine));
        intersectionPoints = lineIntersections.points;
        break;
      case Id.ELLIPSE:
        cursorInObject = (((positionX - object.x) * (positionX - object.x)) / (object.width * object.width)) +
          (((positionY - object.y) * (positionY - object.y)) / (object.height * object.height)) <= 1;
        break;
      case Id.POLYGON:
        const polygonIntersections = svgIntersections.intersect(svgIntersections.shape('polygon', { points: object.vertices }),
          svgIntersections.shape('polyline', selectorLine));
        cursorInObject = (((positionX - object.x) * (positionX - object.x)) / (object.width * object.width)) +
          (((positionY - object.y) * (positionY - object.y)) / (object.height * object.height)) <= 1;
        intersectionPoints = polygonIntersections.points;
        break;
    }
    return (intersectionPoints.length > 0) || cursorInObject;
  }

  objectInBox(object: ITools, previewBox: IPreviewBox): boolean {
    let intersectionPoints = [];
    const selectorBox = { x: previewBox.x, y: previewBox.y, width: previewBox.width, height: previewBox.height };
    const objectIsInsideBox = (previewBox.x < object.x && previewBox.y < object.y
      && previewBox.width > (object.width - previewBox.x + object.x) && previewBox.height > (object.height - previewBox.y + object.y));
    let boxIsInsideObject = false;
    switch (object.id) {
      case (Id.RECTANGLE):
        const rectIntersections = svgIntersections.intersect(svgIntersections.shape('rect', { x: object.x, y: object.y, width: object.width,
          height: object.height}),
          svgIntersections.shape('rect', selectorBox));
          boxIsInsideObject = (previewBox.x > object.x && previewBox.y > object.y
            && previewBox.width < (object.width - previewBox.x + object.x)
            && previewBox.height < (object.height - previewBox.y + object.y));
        intersectionPoints = rectIntersections.points;
        break;
      case Id.CRAYON: case Id.PAINTBRUSH: case Id.LINE:
        const lineIntersections = svgIntersections.intersect(svgIntersections.shape('polyline', { points: object.points }),
          svgIntersections.shape('rect', selectorBox));
        intersectionPoints = lineIntersections.points;
        break;
      case Id.ELLIPSE:
        const ellipseIntersections = svgIntersections.intersect(svgIntersections.shape('ellipse', { cx: object.x, cy: object.y,
          rx: object.width, ry: object.height }),
        svgIntersections.shape('rect', selectorBox));
        boxIsInsideObject = (previewBox.x > (object.x - object.width) && previewBox.y > (object.y - object.height)
          && previewBox.width < ((object.width * 2) - previewBox.x + (object.x - object.width))
          && previewBox.height < ((object.height * 2) - previewBox.y + (object.y - object.height)));
        intersectionPoints = ellipseIntersections.points;
        break;
      case Id.POLYGON:
        const polygonIntersections = svgIntersections.intersect(svgIntersections.shape('polygon', { points: object.vertices }),
        svgIntersections.shape('rect', selectorBox));
        boxIsInsideObject = (previewBox.x > (object.x - object.width) && previewBox.y > (object.y - object.height)
          && previewBox.width < ((object.width * 2) - previewBox.x + (object.x - object.width))
          && previewBox.height < ((object.height * 2) - previewBox.y + (object.y - object.height)));
        intersectionPoints = polygonIntersections.points;
    }
    return (intersectionPoints.length > 0) || objectIsInsideBox || boxIsInsideObject;
  }
}
