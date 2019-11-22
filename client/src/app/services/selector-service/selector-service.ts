import { ControlPoints } from 'src/app/drawing-view/components/tools/assets/constants/selector-constants';
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
    const difference = this.topCornerX - cursorX;
    for (const drawing of this.selectedObjects) {
      this.parsePolylinePoints(difference, 0, drawing);
      const drawingDifference = drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON ? difference / 2 : difference;
      drawing.x -= drawingDifference;
      if (drawing.scaleX) {
        drawing.scaleX += drawingDifference / drawing.width;
      }
      drawing.width += drawingDifference;
    }
    this.topCornerX = cursorX;
  }

  resizeYPosition(cursorY: number) {
    const difference = this.topCornerY - cursorY;
    for (const drawing of this.selectedObjects) {
      this.parsePolylinePoints(0, difference, drawing);
      const drawingDifference = drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON ? difference / 2 : difference;
      drawing.y -= drawingDifference;
      if (drawing.scaleY) {
        drawing.scaleY += drawingDifference / drawing.height;
      }
      drawing.height += drawingDifference;
    }
    this.topCornerY = cursorY;
  }

  resizeXAxis(cursorX: number) {
    const difference = cursorX - this.furthestX;
    for (const drawing of this.selectedObjects) {
      const drawingDifference = drawing.id === Id.ELLIPSE ? difference / 2 : difference;
      if (drawing.scaleX) {
        if (drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON) {
          drawing.x += drawingDifference;
        }
        drawing.scaleX += drawingDifference / drawing.width;
      }
      drawing.width += drawingDifference;
    }
    this.furthestX = cursorX;
  }

  resizeYAxis(cursorY: number) {
    const difference = cursorY - this.furthestY;
    for (const drawing of this.selectedObjects) {
      const drawingDifference = drawing.id === Id.ELLIPSE ? difference / 2 : difference;
      if (drawing.scaleY) {
        if (drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON) {
          drawing.y += drawingDifference;
        }
        drawing.scaleY += drawingDifference / drawing.height;
      }
      drawing.height += drawingDifference;
    }
    this.furthestY = cursorY;
  }

  resizeAxesWithAspectRatio(cursorX: number, cursorY: number, point: ControlPoints) {
    const differenceXAxis = cursorX - this.furthestX;
    const differenceYAxis = cursorY - this.furthestY;
    const differenceXPosition = this.topCornerX - cursorX;
    const differenceYPosition = this.topCornerY - cursorY;
    const differenceX = Math.abs(differenceXAxis) < Math.abs(differenceXPosition) ? differenceXAxis : differenceXPosition;
    const differenceY = Math.abs(differenceYAxis) < Math.abs(differenceYPosition) ? differenceYAxis : differenceYPosition;
    const difference = differenceX < 0 || differenceY < 0 ? Math.max(differenceX, differenceY) : Math.min(differenceX, differenceY);
    switch (point) {
      case ControlPoints.TOP_LEFT:
        for (const drawing of this.selectedObjects) {
          this.parsePolylinePoints(difference, difference, drawing);
          const drawingDifference = drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON ? difference / 2 : difference;
          drawing.x -= drawingDifference;
          drawing.y -= drawingDifference;
          this.adjustScaleAndDimensions(drawing, drawingDifference);
        }
        this.topCornerX -= difference;
        this.topCornerY -= difference;
        break;
      case ControlPoints.TOP_RIGHT:
        for (const drawing of this.selectedObjects) {
          this.parsePolylinePoints(0, difference, drawing);
          let drawingDifference = drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON ? difference / 2 : difference;
          if (drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON) {
            drawing.x += drawingDifference;
            drawing.y -= drawingDifference;
          } else {
            drawing.y -= drawingDifference;
          }
          drawingDifference = drawing.id === Id.POLYGON ? difference : drawingDifference;
          this.adjustScaleAndDimensions(drawing, drawingDifference);
        }
        this.furthestX += difference;
        this.topCornerY -= difference;
        break;
      case ControlPoints.BOTTOM_LEFT:
        for (const drawing of this.selectedObjects) {
          this.parsePolylinePoints(difference, 0, drawing);
          let drawingDifference = drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON ? difference / 2 : difference;
          if (drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON) {
            drawing.x -= drawingDifference;
            drawing.y += drawingDifference;
          } else {
            drawing.x -= drawingDifference;
          }
          drawingDifference = drawing.id === Id.POLYGON ? difference : drawingDifference;
          this.adjustScaleAndDimensions(drawing, drawingDifference);
        }
        this.topCornerX -= difference;
        this.furthestY += difference;
        break;
      case ControlPoints.BOTTOM_RIGHT:
        for (const drawing of this.selectedObjects) {
          const drawingDifference = drawing.id === Id.ELLIPSE ? difference / 2 : difference;
          if (drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON) {
            drawing.y += drawingDifference;
            drawing.x += drawingDifference;
          }
          this.adjustScaleAndDimensions(drawing, drawingDifference);
        }
        this.furthestX += difference;
        this.furthestY += difference;
        break;
      default:
        break;
    }
  }

  resizeYAxesFromCenter(cursorY: number): void {
    const differenceBottom = cursorY - this.furthestY;
    const differenceTop = this.topCornerY - cursorY;
    const difference = Math.abs(differenceBottom) < Math.abs(differenceTop) ? differenceBottom : differenceTop;
    for (const drawing of this.selectedObjects) {
      this.parsePolylinePoints(0, difference, drawing);
      if (drawing.id !== Id.ELLIPSE && drawing.id !== Id.POLYGON) {
        drawing.y -= difference;
      }
      if (drawing.scaleY) {
        drawing.scaleY += (difference * 2) / drawing.height;
      }
      if (drawing.id !== Id.ELLIPSE && drawing.id !== Id.POLYGON) {
        drawing.height += difference;
      }
      drawing.height += difference;
    }
    this.furthestY = Math.abs(differenceBottom) < Math.abs(differenceTop) ? cursorY : this.furthestY + difference;
    this.topCornerY = Math.abs(differenceBottom) < Math.abs(differenceTop) ? this.topCornerY - difference : cursorY;
  }

  resizeXAxesFromCenter(cursorX: number): void {
    const differenceBottom = cursorX - this.furthestX;
    const differenceTop = this.topCornerX - cursorX;
    const difference = Math.abs(differenceBottom) < Math.abs(differenceTop) ? differenceBottom : differenceTop;
    for (const drawing of this.selectedObjects) {
      this.parsePolylinePoints(difference, 0, drawing);
      if (drawing.id !== Id.ELLIPSE && drawing.id !== Id.POLYGON) {
        drawing.x -= difference;
      }
      if (drawing.scaleX) {
        drawing.scaleX += (difference * 2) / drawing.width;
      }
      if (drawing.id !== Id.ELLIPSE && drawing.id !== Id.POLYGON) {
        drawing.width += difference;
      }
      drawing.width += difference;
    }
    this.furthestX = Math.abs(differenceBottom) < Math.abs(differenceTop) ? cursorX : this.furthestX + difference;
    this.topCornerX = Math.abs(differenceBottom) < Math.abs(differenceTop) ? this.topCornerX - difference : cursorX;
  }

  adjustScaleAndDimensions(drawing: ITools, difference: number) {
    if (drawing.scaleX && drawing.scaleY) {
      drawing.scaleX += difference / drawing.width;
      drawing.scaleY += difference / drawing.height;
    }
    drawing.width += difference;
    drawing.height += difference;
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
