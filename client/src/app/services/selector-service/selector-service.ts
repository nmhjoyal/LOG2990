import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
// tslint:disable-next-line: no-implicit-dependencies
import * as svgIntersections from 'svg-intersections';

export class SelectorService {
  selectedObjects: Set<ITools>;
  topCornerX: number;
  topCornerY: number;
  bottomCornerX: number;
  bottomCornerY: number;
  width: number;
  height: number;

  constructor() {
    this.selectedObjects = new Set<ITools>();
    this.topCornerX = 0;
    this.topCornerY = 0;
    this.bottomCornerX = 0;
    this.bottomCornerY = 0;
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
    this.bottomCornerX = drawing.x + drawing.width;
    this.bottomCornerY = drawing.y + drawing.height;
  }

  checkForItems(isReverseSelection: boolean, drawings: ITools[], previewBoxX: number, previewBoxY: number): void {
    if (!isReverseSelection) {
      this.selectedObjects.clear();
    }
    for (const drawing of drawings) {
      if (this.objectInBox(drawing, previewBoxX, previewBoxY)) {
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
    this.bottomCornerX = cursorX >= initialX ? cursorX : initialX;
    this.bottomCornerY = cursorY >= initialY ? cursorY : initialY;
    this.topCornerX = previewBoxX + this.bottomCornerX;
    this.topCornerY = previewBoxY + this.bottomCornerY;
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
    this.bottomCornerX = 0;
    this.bottomCornerY = 0;
  }

  cursorTouchesObject(object: ITools, positionX: number, positionY: number): boolean {
    return (object.x <= positionX && object.y <= positionY && (object.x + object.width) >= positionX &&
            (object.y + object.height) >= positionY);
  }

  objectInBox(object: ITools, topX: number, topY: number): boolean {
    const intersections = svgIntersections.intersect(svgIntersections.shape('rect', { x: object.x, y: object.y, width: object.width,
      height: object.height}),
      svgIntersections.shape('rect', { x: topX, y: topY, width: this.MinWidth, height: this.MinHeight}));
    return (intersections === 0);
    // return (((object.x <= this.bottomCornerX && (object.x + object.width) >= this.bottomCornerX) ||
    // (object.x + object.width) <= this.bottomCornerX) && ((object.y <= this.bottomCornerY &&
    // (object.y + object.height) >= this.bottomCornerY) || (object.y + object.height) <= this.bottomCornerY))
    // && (((object.x >= topX && (object.x + object.width) <= topX) || (object.x + object.width) >= topX)
    // && ((object.y >= topY && (object.y + object.height) <= topY) || (object.y + object.height) >= topY));
  }
}
