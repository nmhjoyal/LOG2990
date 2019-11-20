import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { IComplexPath } from 'src/app/drawing-view/components/tools/assets/interfaces/drawing-tool-interface';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
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

  parsePolylinePoints(differenceX: number, differenceY: number, copiedObject: ITools): void {
    let splitPoints: string[] = [];
    if ('points' in copiedObject) {
      // tslint:disable-next-line: no-non-null-assertion because it is verified as defined
      splitPoints = copiedObject.points!.split(/[ ,]+/).filter(Boolean);
    }
    if ('vertices' in copiedObject) {
      // tslint:disable-next-line: no-non-null-assertion because it is verified as defined
      splitPoints = copiedObject.vertices!.split(/[ ,]+/).filter(Boolean);
    }
    let newPoints = '';
    for (let i = 0; i < splitPoints.length; i += 2 ) {
      newPoints += (parseInt(splitPoints[i], 10) - differenceX).toString()
      + ','
      + (parseInt(splitPoints[i + 1], 10) - differenceY).toString()
      + ' ';
    }

    const newPaths: IComplexPath[] = [];
    if (copiedObject.paths) {
      for (const path of copiedObject.paths) {
        const pathMX = path.path.slice(1, path.path.indexOf(' '));
        const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
        const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
        const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);
        newPaths.push( { path : 'M' + (parseInt(pathMX, 10) - differenceX).toString()
          + ' '
          + (parseInt(pathMY, 10) - differenceY).toString()
          + 'L' + (parseInt(pathLX, 10) - differenceX).toString()
          + ' '
          + (parseInt(pathLY, 10) - differenceY).toString(),
          pathWidth: path.pathWidth });

      }
    }
    if (copiedObject.hasOwnProperty('points')) {
      copiedObject.points = newPoints;
    }
    if (copiedObject.hasOwnProperty('vertices')) {
      copiedObject.vertices = newPoints;
    }
    if (copiedObject.hasOwnProperty('paths')) {
      copiedObject.paths = newPaths;
    }
  }

  resizeXPosition(cursorX: number) {
    if (cursorX > this.topCornerX && cursorX <= this.furthestX) {
      for (const drawing of this.selectedObjects) {
        const difference = cursorX - this.topCornerX;
        this.parsePolylinePoints(-difference, 0, drawing);
        drawing.x = drawing.x + difference <= (drawing.width + drawing.x) ? drawing.x + difference : drawing.width;
        drawing.width = drawing.width - difference > 0 ? drawing.width - difference : drawing.width;
        if (drawing.scaleX && difference < drawing.width) {
          drawing.scaleX *= (drawing.width - difference) / drawing.width;
        }
      }
      this.topCornerX = cursorX;
    } else if (cursorX < this.topCornerX) {
      for (const drawing of this.selectedObjects) {
        const difference = this.topCornerX - cursorX;
        this.parsePolylinePoints(difference, 0, drawing);
        drawing.x = drawing.x - difference > 0 ? drawing.x - difference : drawing.x;
        drawing.width += difference;
        if (drawing.scaleX) {
          drawing.scaleX *= (drawing.width + difference) / drawing.width;
        }
      }
      this.topCornerX = cursorX;
    }
  }

  resizeYPosition(cursorY: number) {
    if (cursorY > this.topCornerY && cursorY <= this.furthestY) {
      for (const drawing of this.selectedObjects) {
        const difference = cursorY - this.topCornerY;
        this.parsePolylinePoints(0, -difference, drawing);
        drawing.y = drawing.y + difference <= (drawing.height + drawing.y) ? drawing.y + difference : drawing.height;
        drawing.height = drawing.height - difference > 0 ? drawing.height - difference : drawing.height;
        if (drawing.scaleY && difference < drawing.height) {
          drawing.scaleY *= (drawing.height - difference) / drawing.height;
        }
      }
      this.topCornerY = cursorY;
    } else if (cursorY < this.topCornerY) {
      for (const drawing of this.selectedObjects) {
        const difference = this.topCornerY - cursorY;
        this.parsePolylinePoints(0, difference, drawing);
        drawing.y = drawing.y - difference > 0 ? drawing.y - difference : drawing.y;
        drawing.height += difference;
        if (drawing.scaleY) {
          drawing.scaleY *= (drawing.height + difference) / drawing.height;
        }
      }
      this.topCornerY = cursorY;
    }
  }

  resizeXAxis(cursorX: number) {
    if (cursorX > this.furthestX) {
      for (const drawing of this.selectedObjects) {
        const difference = cursorX - this.furthestX;
        drawing.width += difference;
        if (drawing.scaleX) {
          drawing.scaleX *= (drawing.width + difference) / drawing.width;
        }
      }
      this.furthestX = cursorX;
    } else if (cursorX < this.furthestX && cursorX >= this.topCornerX) {
      for (const drawing of this.selectedObjects) {
        const difference = this.furthestX - cursorX;
        drawing.width = drawing.width - difference > 0 ? drawing.width - difference : drawing.width;
        if (drawing.scaleX && difference < drawing.width) {
          drawing.scaleX *= (drawing.width - difference) / drawing.width;
        }
      }
      this.furthestX = cursorX;
    }
  }

  resizeYAxis(cursorY: number) {
    if (cursorY > this.furthestY) {
      for (const drawing of this.selectedObjects) {
        const difference = cursorY - this.furthestY;
        drawing.height += difference;
        if (drawing.scaleY) {
          drawing.scaleY *= (drawing.height + difference) / drawing.height;
        }
      }
      this.furthestY = cursorY;
    } else if (cursorY < this.furthestY && cursorY >= this.topCornerY) {
      for (const drawing of this.selectedObjects) {
        const difference = this.furthestY - cursorY;
        drawing.height = drawing.height - difference > 0 ? drawing.height - difference : drawing.height;
        if (drawing.scaleY && difference < drawing.height) {
          drawing.scaleY *= (drawing.height - difference) / drawing.height;
        }
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
