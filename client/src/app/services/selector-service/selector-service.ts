import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { IPreviewBox } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ISavedDrawing } from '../../../../../common/drawing-information/IDrawing';
import { ClipboardService } from '../clipboard/clipboard-service';

export class SelectorService {
  selectedObjects: Set<ISavedDrawing>;
  clipboardHelper: ClipboardService;
  topCornerX: number;
  topCornerY: number;
  furthestX: number;
  furthestY: number;

  constructor() {
    this.selectedObjects = new Set<ISavedDrawing>();
    this.topCornerX = 0;
    this.topCornerY = 0;
    this.furthestX = 0;
    this.furthestY = 0;
  }

  get selectorBox(): IPreviewBox {
    return { x: this.topCornerX, y: this.topCornerY, width: this.MinWidth, height: this.MinHeight };
  }

  get MinWidth(): number {
    return Math.abs(this.furthestX - this.topCornerX);
  }

  get MinHeight(): number {
    return Math.abs(this.furthestY - this.topCornerY);
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
    this.topCornerX = x;
    this.topCornerY = y;
    this.furthestX = x + width;
    this.furthestY = y + height;
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
    this.topCornerX = previewBoxX + bottomCornerX;
    this.topCornerY = previewBoxY + bottomCornerY;
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
    this.topCornerX = x < this.topCornerX ? x : this.topCornerX;
    this.topCornerY = y < this.topCornerY ? y : this.topCornerY;
    this.furthestX = this.furthestX < (x + width) ? (x + width) : this.furthestX;
    this.furthestY = this.furthestY < (y + height) ? (y + height) : this.furthestY;
  }

  recalculateShape(windowWidth: number, windowHeight: number): void {
    this.topCornerX = windowWidth;
    this.topCornerY = windowHeight;
    this.furthestX = 0;
    this.furthestY = 0;
    for (const object of this.selectedObjects) {
      this.updateSelectorShape(object);
    }
  }

  resetSize(): void {
    this.furthestX = 0;
    this.furthestY = 0;
  }

  resetSelectorService(): void {
    this.selectedObjects.clear();
    this.resetSize();
    this.topCornerX = 0;
    this.topCornerY = 0;
  }

  cursorTouchesObject(object: ISavedDrawing, positionX: number, positionY: number): boolean {
    return ClickHelper.cursorTouchesObjectBorder(object, positionX, positionY) ||
      ClickHelper.cursorInsideObject(object, positionX, positionY);
  }

  objectInBox(object: ISavedDrawing, previewBox: IPreviewBox): boolean {
    return ClickHelper.objectSharesBoxArea(object, previewBox);
  }
}
