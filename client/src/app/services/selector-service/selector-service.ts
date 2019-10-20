import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { IPreviewBox } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import { Id } from 'src/app/drawing-view/components/tools/assets/tool-constants';
// tslint:disable-next-line: no-implicit-dependencies
import * as svgIntersections from 'svg-intersections';

export class SelectorService {
  selectedObjects: Set<ITools>;
  topCornerX: number;
  topCornerY: number;
  width: number;
  height: number;

  constructor() {
    this.selectedObjects = new Set<ITools>();
    this.topCornerX = 0;
    this.topCornerY = 0;
    this.width = 0;
    this.height = 0;
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
    this.topCornerX = drawing.x;
    this.topCornerY = drawing.y;
    this.width = drawing.x + drawing.width;
    this.height = drawing.y + drawing.height;
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
    if (drawing.x < this.topCornerX) {
      this.topCornerX = drawing.x;
    }
    if (drawing.y < this.topCornerY) {
      this.topCornerY = drawing.y;
    }
    if (this.width < (drawing.x + drawing.width)) {
      this.width = drawing.x + drawing.width;
    }
    if (this.height < (drawing.y + drawing.height)) {
      this.height = drawing.y + drawing.height;
    }
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
      case Id.CRAYON: case Id.PAINTBRUSH:
        const lineIntersections = svgIntersections.intersect(svgIntersections.shape('polyline', { points: object.points }),
          svgIntersections.shape('polyline', selectorLine));
        intersectionPoints = lineIntersections.points;
        break;
    }
    return (intersectionPoints.length > 0) || cursorInObject;
  }

  objectInBox(object: ITools, previewBox: IPreviewBox): boolean {
    let intersectionPoints = [];
    const selectorBox = { x: previewBox.x, y: previewBox.y, width: previewBox.width, height: previewBox.height };
    const objectIsInsideBox = (previewBox.x < object.x && previewBox.y < object.y
      && previewBox.width > (object.width - previewBox.x + object.x) && previewBox.height > (object.height - previewBox.y + object.y));
    switch (object.id) {
      case (Id.RECTANGLE):
        const rectIntersections = svgIntersections.intersect(svgIntersections.shape('rect', { x: object.x, y: object.y, width: object.width,
          height: object.height}),
          svgIntersections.shape('rect', selectorBox));
        intersectionPoints = rectIntersections.points;
        break;
      case Id.CRAYON: case Id.PAINTBRUSH:
        const lineIntersections = svgIntersections.intersect(svgIntersections.shape('polyline', { points: object.points }),
          svgIntersections.shape('rect', selectorBox));
        intersectionPoints = lineIntersections.points;
        break;
    }
    return (intersectionPoints.length > 0) || objectIsInsideBox;
  }
}
