import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { IPreviewBox } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ISavedDrawing } from '../../../../../common/drawing-information/IDrawing';

export class SelectorService {
  selectedObjects: Set<ISavedDrawing>;
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

  resizeXPosition(cursorX: number) {
    if (cursorX > this.topCornerX && cursorX <= this.furthestX) {
      for (const drawing of this.selectedObjects) {
        const difference = cursorX - this.topCornerX;
        drawing.x = drawing.x + difference <= (drawing.width + drawing.x) ? drawing.x + difference : drawing.width;
        drawing.width = drawing.width - difference > 0 ? drawing.width - difference : drawing.width;
      }
      this.topCornerX = cursorX;
    } else if (cursorX < this.topCornerX) {
      for (const drawing of this.selectedObjects) {
        const difference = this.topCornerX - cursorX;
        drawing.x = drawing.x - difference > 0 ? drawing.x - difference : drawing.x;
        drawing.width += difference;
      }
      this.topCornerX = cursorX;
    }
  }

  resizeYPosition(cursorY: number) {
    if (cursorY > this.topCornerY && cursorY <= this.furthestY) {
      for (const drawing of this.selectedObjects) {
        const difference = cursorY - this.topCornerY;
        drawing.y = drawing.y + difference <= (drawing.height + drawing.y) ? drawing.y + difference : drawing.height;
        drawing.height = drawing.height - difference > 0 ? drawing.height - difference : drawing.height;
      }
      this.topCornerY = cursorY;
    } else if (cursorY < this.topCornerY) {
      for (const drawing of this.selectedObjects) {
        const difference = this.topCornerY - cursorY;
        drawing.y = drawing.y - difference > 0 ? drawing.y - difference : drawing.y;
        drawing.height += difference;
      }
      this.topCornerY = cursorY;
    }
  }

  resizeXAxis(cursorX: number) {
    if (cursorX > this.furthestX) {
      for (const drawing of this.selectedObjects) {
        drawing.width += cursorX - this.furthestX;
      }
      this.furthestX = cursorX;
    } else if (cursorX < this.furthestX && cursorX >= this.topCornerX) {
      for (const drawing of this.selectedObjects) {
        const difference = this.furthestX - cursorX;
        drawing.width = drawing.width - difference > 0 ? drawing.width - difference : drawing.width;
      }
      this.furthestX = cursorX;
    }
  }

  resizeYAxis(cursorY: number) {
    if (cursorY > this.furthestY) {
      for (const drawing of this.selectedObjects) {
        drawing.height += cursorY - this.furthestY;
      }
      this.furthestY = cursorY;
    } else if (cursorY < this.furthestY && cursorY >= this.topCornerY) {
      for (const drawing of this.selectedObjects) {
        const difference = this.furthestY - cursorY;
        drawing.height = drawing.height - difference > 0 ? drawing.height - difference : drawing.height;
      }
      this.furthestY = cursorY;
    }
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
