import { ControlPoints } from 'src/app/drawing-view/components/tools/assets/constants/selector-constants';
import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { IComplexPath } from '../../drawing-view/components/tools/assets/interfaces/drawing-tool-interface';
import { SelectorService } from '../selector-service/selector-service';

export class ResizeService {

  constructor(protected selectorService: SelectorService) {
  }

  movePoints(differenceX: number, differenceY: number, copiedObject: ITools): void {
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
    const difference = this.selectorService.topCornerX - cursorX;
    for (const drawing of this.selectorService.SelectedObjects) {
      this.movePoints(difference, 0, drawing);
      const drawingDifference = drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON ? difference / 2 : difference;
      drawing.x -= drawingDifference;
      if (drawing.scaleX) {
        drawing.scaleX += drawingDifference / drawing.width;
      }
      drawing.width += drawingDifference;
    }
    this.selectorService.topCornerX = cursorX;
  }

  resizeYPosition(cursorY: number) {
    const difference = this.selectorService.topCornerY - cursorY;
    for (const drawing of this.selectorService.SelectedObjects) {
      this.movePoints(0, difference, drawing);
      const drawingDifference = drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON ? difference / 2 : difference;
      drawing.y -= drawingDifference;
      if (drawing.scaleY) {
        drawing.scaleY += drawingDifference / drawing.height;
      }
      drawing.height += drawingDifference;
    }
    this.selectorService.topCornerY = cursorY;
  }

  resizeXAxis(cursorX: number) {
    const difference = cursorX - this.selectorService.furthestX;
    for (const drawing of this.selectorService.SelectedObjects) {
      const drawingDifference = drawing.id === Id.ELLIPSE ? difference / 2 : difference;
      if (drawing.scaleX) {
        if (drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON) {
          drawing.x += drawingDifference;
        }
        drawing.scaleX += drawingDifference / drawing.width;
      }
      drawing.width += drawingDifference;
    }
    this.selectorService.furthestX = cursorX;
  }

  resizeYAxis(cursorY: number) {
    const difference = cursorY - this.selectorService.furthestY;
    for (const drawing of this.selectorService.SelectedObjects) {
      const drawingDifference = drawing.id === Id.ELLIPSE ? difference / 2 : difference;
      if (drawing.scaleY) {
        if (drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON) {
          drawing.y += drawingDifference;
        }
        drawing.scaleY += drawingDifference / drawing.height;
      }
      drawing.height += drawingDifference;
    }
    this.selectorService.furthestY = cursorY;
  }

  resizeAxesWithAspectRatio(cursorX: number, cursorY: number, point: ControlPoints) {
    const differenceXAxis = cursorX - this.selectorService.furthestX;
    const differenceYAxis = cursorY - this.selectorService.furthestY;
    const differenceXPosition = this.selectorService.topCornerX - cursorX;
    const differenceYPosition = this.selectorService.topCornerY - cursorY;
    const differenceX = Math.abs(differenceXAxis) < Math.abs(differenceXPosition) ? differenceXAxis : differenceXPosition;
    const differenceY = Math.abs(differenceYAxis) < Math.abs(differenceYPosition) ? differenceYAxis : differenceYPosition;
    const difference = differenceX < 0 || differenceY < 0 ? Math.max(differenceX, differenceY) : Math.min(differenceX, differenceY);
    switch (point) {
      case ControlPoints.TOP_LEFT:
        for (const drawing of this.selectorService.SelectedObjects) {
          this.movePoints(difference, difference, drawing);
          const drawingDifference = drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON ? difference / 2 : difference;
          drawing.x -= drawingDifference;
          drawing.y -= drawingDifference;
          this.adjustScaleAndDimensions(drawing, drawingDifference);
        }
        this.selectorService.topCornerX -= difference;
        this.selectorService.topCornerY -= difference;
        break;
      case ControlPoints.TOP_RIGHT:
        for (const drawing of this.selectorService.SelectedObjects) {
          this.movePoints(0, difference, drawing);
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
        this.selectorService.furthestX += difference;
        this.selectorService.topCornerY -= difference;
        break;
      case ControlPoints.BOTTOM_LEFT:
        for (const drawing of this.selectorService.SelectedObjects) {
          this.movePoints(difference, 0, drawing);
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
        this.selectorService.topCornerX -= difference;
        this.selectorService.furthestY += difference;
        break;
      case ControlPoints.BOTTOM_RIGHT:
        for (const drawing of this.selectorService.SelectedObjects) {
          const drawingDifference = drawing.id === Id.ELLIPSE ? difference / 2 : difference;
          if (drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON) {
            drawing.y += drawingDifference;
            drawing.x += drawingDifference;
          }
          this.adjustScaleAndDimensions(drawing, drawingDifference);
        }
        this.selectorService.furthestX += difference;
        this.selectorService.furthestY += difference;
        break;
      default:
        break;
    }
  }

  resizeYAxesFromCenter(cursorY: number): void {
    const differenceBottom = cursorY - this.selectorService.furthestY;
    const differenceTop = this.selectorService.topCornerY - cursorY;
    const difference = Math.abs(differenceBottom) < Math.abs(differenceTop) ? differenceBottom : differenceTop;
    for (const drawing of this.selectorService.SelectedObjects) {
      this.movePoints(0, difference, drawing);
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
    this.selectorService.furthestY = Math.abs(differenceBottom) < Math.abs(differenceTop) ?
        cursorY : this.selectorService.furthestY + difference;
    this.selectorService.topCornerY = Math.abs(differenceBottom) < Math.abs(differenceTop) ?
        this.selectorService.topCornerY - difference : cursorY;
  }

  resizeXAxesFromCenter(cursorX: number): void {
    const differenceBottom = cursorX - this.selectorService.furthestX;
    const differenceTop = this.selectorService.topCornerX - cursorX;
    const difference = Math.abs(differenceBottom) < Math.abs(differenceTop) ? differenceBottom : differenceTop;
    for (const drawing of this.selectorService.SelectedObjects) {
      this.movePoints(difference, 0, drawing);
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
    this.selectorService.furthestX = Math.abs(differenceBottom) < Math.abs(differenceTop) ?
        cursorX : this.selectorService.furthestX + difference;
    this.selectorService.topCornerX = Math.abs(differenceBottom) < Math.abs(differenceTop) ?
        this.selectorService.topCornerX - difference : cursorX;
  }

  adjustScaleAndDimensions(drawing: ITools, difference: number) {
    if (drawing.scaleX && drawing.scaleY) {
      drawing.scaleX += difference / drawing.width;
      drawing.scaleY += difference / drawing.height;
    }
    drawing.width += difference;
    drawing.height += difference;
  }
}
