import { Injectable } from '@angular/core';
import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { IPoint, IPreviewBox } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ISavedDrawing } from '../../../../../common/drawing-information/IDrawing';
import { ClipboardService } from '../clipboard/clipboard-service';
import ParserHelper from '../parser-service/parser.service';

@Injectable({
  providedIn: 'root',
})
export class SelectorService {
  selectedObjects: Set<ISavedDrawing>;
  clipboardHelper: ClipboardService;
  topCorner: IPoint;
  bottomCorner: IPoint;

  constructor() {
    this.selectedObjects = new Set<ISavedDrawing>();
    this.topCorner = {x: 0, y: 0};
    this.bottomCorner = {x: 0, y: 0};
  }

  get selectorBox(): IPreviewBox {
    return { x: this.topCorner.x, y: this.topCorner.y, width: this.MinWidth, height: this.MinHeight };
  }

  get MinWidth(): number {
    return Math.abs(this.bottomCorner.x - this.topCorner.x);
  }

  get MinHeight(): number {
    return Math.abs(this.bottomCorner.y - this.topCorner.y);
  }

  get SelectedObjects(): Set<ISavedDrawing> {
    return this.selectedObjects;
  }

  setBoxToDrawing(drawing: ISavedDrawing): void {
    let x: number = drawing.x;
    let y: number = drawing.y;
    let width: number = drawing.width;
    let height: number = drawing.height;
    if (drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON) {
      x = drawing.x - drawing.width;
      y = drawing.y - drawing.height;
      width = drawing.width * 2;
      height = drawing.height * 2;
    }
    this.topCorner.x = x;
    this.topCorner.y = y;
    this.bottomCorner.x = x + width;
    this.bottomCorner.y = y + height;
  }

  checkForItems(isReverseSelection: boolean, drawings: ISavedDrawing[], previewBox: IPreviewBox): void {
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
    this.topCorner.x = previewBoxX + bottomCornerX;
    this.topCorner.y = previewBoxY + bottomCornerY;
  }

  updateSelectorShape(drawing: ISavedDrawing): void {
    let x: number = drawing.x;
    let y: number = drawing.y;
    let width: number = drawing.width;
    let height: number = drawing.height;
    if (drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON) {
      x = drawing.x - drawing.width;
      y = drawing.y - drawing.height;
      width = drawing.width * 2;
      height = drawing.height * 2;
    }
    this.topCorner.x = x < this.topCorner.x ? x : this.topCorner.x;
    this.topCorner.y = y < this.topCorner.y ? y : this.topCorner.y;
    this.bottomCorner.x = this.bottomCorner.x < (x + width) ? (x + width) : this.bottomCorner.x;
    this.bottomCorner.y = this.bottomCorner.y < (y + height) ? (y + height) : this.bottomCorner.y;
  }

  recalculateShape(windowWidth: number, windowHeight: number): void {
    this.topCorner.x = windowWidth;
    this.topCorner.y = windowHeight;
    this.bottomCorner.x = 0;
    this.bottomCorner.y = 0;
    for (const object of this.selectedObjects) {
      this.updateSelectorShape(object);
    }
  }

  resetSize(): void {
    this.bottomCorner.x = 0;
    this.bottomCorner.y = 0;
  }

  resetSelectorService(): void {
    this.selectedObjects.clear();
    this.resetSize();
    this.topCorner.x = 0;
    this.topCorner.y = 0;
  }

  cursorTouchesObject(object: ISavedDrawing, positionX: number, positionY: number): boolean {
    return ClickHelper.cursorTouchesObjectBorder(object, positionX, positionY) ||
      ClickHelper.cursorInsideObject(object, positionX, positionY);
  }

  objectInBox(object: ISavedDrawing, previewBox: IPreviewBox): boolean {
    return ClickHelper.objectSharesBoxArea(object, previewBox);
  }

  dragObjects(cursorX: number, cursorY: number, windowWidth: number, windowHeight: number): void {
    this.selectedObjects.forEach((movedObject) => {
      if (movedObject.alignX) {
        movedObject.alignX += (cursorX - this.topCorner.x - this.MinWidth / 2);
      } else if (movedObject.sprays) {
        movedObject.sprays.forEach( (spray) => {
          spray.cx += (cursorX - this.topCorner.x - this.MinWidth / 2);
          spray.cy += (cursorY - this.topCorner.y - this.MinHeight / 2);
        });
      }
      movedObject.x += (cursorX - this.topCorner.x - this.MinWidth / 2);
      movedObject.y += (cursorY - this.topCorner.y - this.MinHeight / 2);
      ParserHelper.dragPolylinePoints(cursorX, cursorY, movedObject, this);
    });
    this.recalculateShape(windowWidth, windowHeight);
  }

}
