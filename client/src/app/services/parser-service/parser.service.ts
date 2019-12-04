import { Injectable } from '@angular/core';
import { IComplexPath } from 'src/app/drawing-view/components/tools/assets/interfaces/drawing-tool-interface';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { ControlPoints } from 'src/AppConstants/ControlPoints';
import { GridService } from '../grid/grid.service';
import { SelectorService } from '../selector-service/selector-service';

@Injectable({
  providedIn: 'root',
})
export default class ParserHelper {
  // tslint:disable-next-line: max-line-length because readability is reduced if header is on two lines
  static parsePolylinePoints(cursorX: number, cursorY: number, copiedObject: ITools, offset: number, selectorService: SelectorService): void {
    const newPoints = ParserHelper.initializePoints(copiedObject, selectorService, cursorX, cursorY);

    const newPaths: IComplexPath[] = [];
    if (copiedObject.paths) {
      for (const path of copiedObject.paths) {
        const pathMX = path.path.slice(1, path.path.indexOf(' '));
        const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
        const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
        const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);
        newPaths.push({
          path: 'M' + (parseInt(pathMX, 10) + cursorX - selectorService.topCorner.x
            - selectorService.MinWidth / 2 + offset).toString()
            + ' '
            + (parseInt(pathMY, 10) + cursorY - selectorService.topCorner.y - selectorService.MinHeight / 2
              + offset).toString()
            + 'L' + (parseInt(pathLX, 10) + cursorX - selectorService.topCorner.x
              - selectorService.MinWidth / 2 + offset).toString()
            + ' '
            + (parseInt(pathLY, 10) + cursorY - selectorService.topCorner.y - selectorService.MinHeight / 2
              + offset).toString(),
          pathWidth: path.pathWidth,
        });

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

  static splitPoints(object: ITools): string[] {
    if (object.points) {
      return object.points.split(/[ ,]+/).filter(Boolean);
    }
    if (object.vertices) {
      return object.vertices.split(/[ ,]+/).filter(Boolean);
    }
    return [];
  }

  static moveObject(differenceX: number, differenceY: number, object: ITools): void {
    const points: string[] = this.splitPoints(object);
    let newPoints = '';
    for (let i = 0; i < points.length; i += 2) {
      newPoints += (parseInt(points[i], 10) + differenceX).toString() + ' '
        + (parseInt(points[i + 1], 10) + differenceY).toString();
      if (i !== points.length - 2) {
        newPoints += ', ';
      }
    }

    if (object.sprays) {
      for (const spray of object.sprays) {
        spray.cx -= differenceX;
        spray.cy -= differenceY;
      }
    }

    const newPaths: IComplexPath[] = [];
    if (object.paths) {
      for (const path of object.paths) {
        const pathMX = path.path.slice(1, path.path.indexOf(' '));
        const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
        const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
        const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);
        newPaths.push({
          path: 'M' + (parseInt(pathMX, 10) + differenceX).toString() + ' ' + (parseInt(pathMY, 10) + differenceY).toString()
            + 'L' + (parseInt(pathLX, 10) + differenceX).toString() + ' ' + (parseInt(pathLY, 10) + differenceY).toString(),
          pathWidth: path.pathWidth,
        });
      }
    }
    if (object.points) {
      object.points = newPoints;
    }
    if (object.vertices) {
      object.vertices = newPoints;
    }
    if (object.paths) {
      object.paths = newPaths;
    }
  }

  // tslint:disable-next-line: max-line-length because readability is reduced if header is on two lines
  static dragPolylinePoints(cursorX: number, cursorY: number, movedObject: ITools, selectorService: SelectorService, points?: string, paths?: IComplexPath[]): void {
    const newPoints = points ? points : ParserHelper.initializePoints(movedObject, selectorService, cursorX, cursorY);
    const newPaths: IComplexPath[] = [];
    if (movedObject.paths && !paths) {
      for (const path of movedObject.paths) {
        const pathMX = path.path.slice(1, path.path.indexOf(' '));
        const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
        const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
        const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);

        newPaths.push({
          path: 'M' + (parseInt(pathMX, 10) + cursorX - selectorService.topCorner.x
            - selectorService.MinWidth / 2).toString()
            + ' '
            + (parseInt(pathMY, 10) + cursorY - selectorService.topCorner.y - selectorService.MinHeight / 2).toString()
            + 'L' + (parseInt(pathLX, 10) + cursorX - selectorService.topCorner.x
              - selectorService.MinWidth / 2).toString()
            + ' '
            + (parseInt(pathLY, 10) + cursorY - selectorService.topCorner.y - selectorService.MinHeight / 2).toString(),
          pathWidth: path.pathWidth,
        });

      }
    }
    if (movedObject.hasOwnProperty('points')) {
      movedObject.points = newPoints;
    }
    if (movedObject.hasOwnProperty('vertices')) {
      movedObject.vertices = newPoints;
    }
    if (movedObject.hasOwnProperty('paths')) {
      movedObject.paths = paths ? paths : newPaths;
    }
  }

  // tslint:disable-next-line: max-line-length because it reduces readability if the fn signature is on two lines
  static snapPolylinePoints(cursorX: number, cursorY: number, movedObject: ITools, selectorService: SelectorService, controlPoint: ControlPoints, gridService: GridService): void {
    let splitPoints: string[] = [];
    if ('points' in movedObject) {
      // tslint:disable-next-line: no-non-null-assertion because it is verified as defined
      splitPoints = movedObject.points!.split(/[ ,]+/).filter(Boolean);
    }
    if ('vertices' in movedObject) {
      // tslint:disable-next-line: no-non-null-assertion because it is verified as defined
      splitPoints = movedObject.vertices!.split(/[ ,]+/).filter(Boolean);
    }
    let newPoints = '';
    let paths: IComplexPath[] = [];
    const gridSize = gridService.GridSize;
    const topCornerX = selectorService.topCorner.x;
    const topCornerY = selectorService.topCorner.y;

    switch (controlPoint) {
      case ControlPoints.TOP_LEFT:
        const gridXTopLeft = Math.round(cursorX / gridSize) * gridSize;
        const gridYTopLeft = Math.round(cursorY / gridSize) * gridSize;
        newPoints = ParserHelper.setPoints(splitPoints, topCornerX, topCornerY, gridXTopLeft, gridYTopLeft);
        paths = ParserHelper.setPaths(movedObject, topCornerX, topCornerY, gridXTopLeft, gridYTopLeft);
        break;
      case ControlPoints.TOP_MIDDLE:
        const gridXTopMiddle = Math.round(cursorX / gridSize) * gridSize - ((selectorService.MinWidth / 2) % gridSize);
        const gridYTopMiddle = Math.round(cursorY / gridSize) * gridSize;
        newPoints = ParserHelper.setPoints(splitPoints, topCornerX, topCornerY, gridXTopMiddle, gridYTopMiddle);
        paths = ParserHelper.setPaths(movedObject, topCornerX, topCornerY, gridXTopMiddle, gridYTopMiddle);
        break;
      case ControlPoints.TOP_RIGHT:
        const gridXTopRight = Math.round(cursorX / gridSize) * gridSize - ((selectorService.MinWidth) % gridSize);
        const gridYTopRight = Math.round(cursorY / gridSize) * gridSize;
        newPoints = ParserHelper.setPoints(splitPoints, topCornerX, topCornerY, gridXTopRight, gridYTopRight);
        paths = ParserHelper.setPaths(movedObject, topCornerX, topCornerY, gridXTopRight, gridYTopRight);
        break;
      case ControlPoints.MIDDLE_LEFT:
        const gridXMiddleLeft = Math.round(cursorX / gridSize) * gridSize;
        const gridYMiddleLeft = Math.round(cursorY / gridSize) * gridSize - ((selectorService.MinHeight / 2) % gridSize);
        newPoints = ParserHelper.setPoints(splitPoints, topCornerX, topCornerY, gridXMiddleLeft, gridYMiddleLeft);
        paths = ParserHelper.setPaths(movedObject, topCornerX, topCornerY, gridXMiddleLeft, gridYMiddleLeft);
        break;
      case ControlPoints.MIDDLE:
        const gridXMiddle = Math.round(cursorX / gridSize) * gridSize - ((selectorService.MinWidth / 2) % gridSize);
        const gridYMiddle = Math.round(cursorY / gridSize) * gridSize - ((selectorService.MinHeight / 2) % gridSize);
        newPoints = ParserHelper.setPoints(splitPoints, topCornerX, topCornerY, gridXMiddle, gridYMiddle);
        paths = ParserHelper.setPaths(movedObject, topCornerX, topCornerY, gridXMiddle, gridYMiddle);
        break;
      case ControlPoints.MIDDLE_RIGHT:
        const gridXMiddleRight = Math.round(cursorX / gridSize) * gridSize - ((selectorService.MinWidth) % gridSize);
        const gridYMiddleRight = Math.round(cursorY / gridSize) * gridSize - ((selectorService.MinHeight / 2) % gridSize);
        newPoints = ParserHelper.setPoints(splitPoints, topCornerX, topCornerY, gridXMiddleRight, gridYMiddleRight);
        paths = ParserHelper.setPaths(movedObject, topCornerX, topCornerY, gridXMiddleRight, gridYMiddleRight);
        break;
      case ControlPoints.BOTTOM_LEFT:
        const gridXBottomLeft = Math.round(cursorX / gridSize) * gridSize - gridSize / 2;
        const gridYBottomLeft = Math.round(cursorY / gridSize) * gridSize - ((selectorService.MinHeight) % gridSize);
        newPoints = ParserHelper.setPoints(splitPoints, topCornerX, topCornerY, gridXBottomLeft, gridYBottomLeft);
        paths = ParserHelper.setPaths(movedObject, topCornerX, topCornerY, gridXBottomLeft, gridYBottomLeft);
        break;
      case ControlPoints.BOTTOM_MIDDLE:
        const gridXBottomMiddle = Math.round(cursorX / gridSize) * gridSize - ((selectorService.MinWidth / 2) % gridSize);
        const gridYBottomMiddle = Math.round(cursorY / gridSize) * gridSize - ((selectorService.MinHeight) % gridSize);
        newPoints = ParserHelper.setPoints(splitPoints, topCornerX, topCornerY, gridXBottomMiddle, gridYBottomMiddle);
        paths = ParserHelper.setPaths(movedObject, topCornerX, topCornerY, gridXBottomMiddle, gridYBottomMiddle);
        break;
      case ControlPoints.BOTTOM_RIGHT:
        const gridXBottomRight = Math.round(cursorX / gridSize) * gridSize - ((selectorService.MinWidth) % gridSize);
        const gridYBottomRight = Math.round(cursorY / gridSize) * gridSize - ((selectorService.MinHeight) % gridSize);
        newPoints = ParserHelper.setPoints(splitPoints, topCornerX, topCornerY, gridXBottomRight, gridYBottomRight);
        paths = ParserHelper.setPaths(movedObject, topCornerX, topCornerY, gridXBottomRight, gridYBottomRight);
        break;
      default:
        const gridXDefault = Math.round(cursorX / gridSize) * gridSize;
        const gridYDefault = Math.round(cursorY / gridSize) * gridSize;
        newPoints = ParserHelper.setPoints(splitPoints, topCornerX, topCornerY, gridXDefault, gridYDefault);
        paths = ParserHelper.setPaths(movedObject, topCornerX, topCornerY, gridXDefault, gridYDefault);
        break;
    }
    ParserHelper.dragPolylinePoints(cursorX, cursorY, movedObject, selectorService, newPoints, paths);

  }

  static initializePoints(copiedObject: ITools, selectorService: SelectorService, cursorX: number, cursorY: number): string {
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
    for (let i = 0; i < splitPoints.length; i += 2) {
      newPoints += (parseInt(splitPoints[i], 10) + cursorX - selectorService.topCorner.x - selectorService.MinWidth / 2).toString()
        + ','
        + (parseInt(splitPoints[i + 1], 10) + cursorY - selectorService.topCorner.y - selectorService.MinHeight / 2).toString()
        + ' ';
    }
    return newPoints;
  }

  static setPaths(movedObject: ITools, topCornerX: number, topCornerY: number, gridX: number, gridY: number): IComplexPath[] {
    const paths: IComplexPath[] = [];
    if (movedObject.paths) {
      for (const path of movedObject.paths) {
        const pathMX = path.path.slice(1, path.path.indexOf(' '));
        const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
        const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
        const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);

        const xDistToSelectorBoxMX = parseInt(pathMX, 10) - topCornerX;
        const xDistToSelectorBoxLX = parseInt(pathLX, 10) - topCornerX;
        const yDistToSelectorBoxMY = parseInt(pathMY, 10) - topCornerY;
        const yDistToSelectorBoxLY = parseInt(pathLY, 10) - topCornerY;

        paths.push({
          path: 'M'
            + (gridX + xDistToSelectorBoxMX).toString()
            + ' '
            + (gridY + yDistToSelectorBoxMY).toString()
            + 'L'
            + (gridX + xDistToSelectorBoxLX).toString()
            + ' '
            + (gridY + yDistToSelectorBoxLY).toString(),
          pathWidth: path.pathWidth,
        });
      }
    }
    return paths;
  }

  static setPoints(splitPoints: string[], topCornerX: number, topCornerY: number, gridX: number, gridY: number): string {
    let newPoints = '';
    for (let i = 0; i < splitPoints.length; i += 2) {
      const xDistToSelectorBox = parseInt(splitPoints[i], 10) - topCornerX;
      const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) - topCornerY;

      newPoints += (gridX + xDistToSelectorBox).toString()
        + ','
        + (gridY + yDistToSelectorBox).toString()
        + ' ';
    }
    return newPoints;
  }
}
