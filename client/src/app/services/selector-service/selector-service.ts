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
  width: number;
  height: number;

  constructor(protected toolService: ToolHandlerService) {
    this.selectedObjects = new Set<ITools>();
    this.topCornerX = 0;
    this.topCornerY = 0;
    this.width = 0;
    this.height = 0;
    this.clipboard = new Set<ITools>();
  }

  copy(): void {
    this.clipboard.clear();
    if (this.selectedObjects) {
        this.selectedObjects.forEach((selectedObject) => {
          this.clipboard.add(selectedObject);
      });
    }
  }

  paste(cursorX: number, cursorY: number): void {
    if (this.clipboard.size) {
      const selection: Set<ITools> = this.clipboard;
      selection.forEach((copiedObject) => {
        copiedObject.x = cursorX;
        copiedObject.y = cursorY;
        this.toolService.drawings.push(copiedObject);
      });
    }
  }

  cut(): void {
    this.copy();
    for (let i = 0; i < this.selectedObjects.size; i++) {
      this.toolService.drawings.pop();
    }
    /*this.selectedObjects.forEach((selectedObject) => {
      this.toolService.drawings.delete(selectedObject);
    });*/
  }

  duplicate(): void {
    const selection: Set<ITools> = this.selectedObjects;
    selection.forEach((copiedObject) => {
      copiedObject.x += NumericalValues.DUPLICATE_OFFSET;
      copiedObject.y += NumericalValues.DUPLICATE_OFFSET;
        this.toolService.drawings.push(copiedObject);
    });
  }

  delete(): void {
    for (let i = 0; i < this.selectedObjects.size; i++) {
      this.toolService.drawings.pop();
    }
  }

  get MinWidth(): number {
    return Math.abs(this.width - this.topCornerX);
  }

  get MinHeight(): number {
    return Math.abs(this.height - this.topCornerY);
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
    this.width = x + width;
    this.height = y + height;
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
    this.width = this.width < (x + width) ? (x + width) : this.width;
    this.height = this.height < (y + height) ? (y + height) : this.height;
  }

  recalculateShape(windowWidth: number, windowHeight: number): void {
    this.topCornerX = windowWidth;
    this.topCornerY = windowHeight;
    this.width = 0;
    this.height = 0;
    for (const object of this.selectedObjects) {
      this.updateSelectorShape(object);
    }
  }

  resetSize(): void {
    this.width = 0;
    this.height = 0;
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
