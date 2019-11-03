import { Injectable } from '@angular/core';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { IPreviewBox } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import { Id } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
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
  furthestY: number;
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
    this.furthestY = 0;
    this.pasteOffset = 0;
    this.lastCursorX = 0;
    this.lastCursorY = 0;
  }

  copy(): void {
    if (this.selectedObjects) {
      this.clipboard.clear();
      this.selectedObjects.forEach((selectedObject) => {
        this.clipboard.add({...selectedObject});
      });
    }
  }

  paste(cursorX: number, cursorY: number): void {
    if (this.clipboard.size) {
      if (cursorX === this.lastCursorX && cursorY === this.lastCursorY) {
        this.pasteOffset += NumericalValues.DUPLICATE_OFFSET;
      } else { this.pasteOffset = 0; }
      this.clipboard.forEach((copiedObject) => {
        copiedObject.x += cursorX - this.topCornerX - this.MinWidth / 2 + this.pasteOffset;
        copiedObject.y += cursorY - this.topCornerY - this.MinHeight / 2 + this.pasteOffset;
        if ((copiedObject.x + this.MinWidth) > window.innerWidth || (copiedObject.y + this.MinHeight) > window.innerHeight) {
          copiedObject.x -= this.pasteOffset - NumericalValues.DUPLICATE_OFFSET / 2;
          copiedObject.y -= this.pasteOffset - NumericalValues.DUPLICATE_OFFSET / 2;
          this.pasteOffset = 0;
        }
        this.parsePolylinePoints(cursorX, cursorY, copiedObject);
        this.toolService.drawings.push({...copiedObject});
        // this.SelectedObjects.clear();
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
    this.paste(this.topCornerX + this.MinWidth / 2  + NumericalValues.DUPLICATE_OFFSET,
               this.topCornerY + this.MinHeight / 2 + NumericalValues.DUPLICATE_OFFSET );
    /*this.SelectedObjects.forEach((selectedObject) => {
      const copiedObject: ITools = selectedObject;
      if (copiedObject.x + copiedObject.width > window.innerWidth || copiedObject.y + copiedObject.height > window.innerHeight ) {
        copiedObject.x -= this.pasteOffset;
        copiedObject.y -= this.pasteOffset;
      } else {
        copiedObject.x += this.pasteOffset;
        copiedObject.y += this.pasteOffset;
      }
      this.toolService.drawings.push({...copiedObject});
    });*/
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
    return Math.abs(this.furthestY - this.topCornerY);
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
    this.furthestY = y + height;
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

  cursorTouchesObject(object: ITools, positionX: number, positionY: number): boolean {
    return ClickHelper.cursorTouchesObjectBorder(object, positionX, positionY) ||
      ClickHelper.cursorInsideObject(object, positionX, positionY);
  }

  objectInBox(object: ITools, previewBox: IPreviewBox): boolean {
    return ClickHelper.objectSharesBoxArea(object, previewBox);
  }
}
