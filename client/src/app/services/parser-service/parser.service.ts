import { Injectable } from '@angular/core';
import { IComplexPath } from 'src/app/drawing-view/components/tools/assets/interfaces/drawing-tool-interface';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { SelectorService } from '../selector-service/selector-service';

@Injectable({
  providedIn: 'root',
})
export default class ParserHelper {
// tslint:disable-next-line: max-line-length because readability is reduced if header is on two lines
  static parsePolylinePoints(cursorX: number, cursorY: number, copiedObject: ITools, offset: number, selectorService: SelectorService): void {
    const newPoints = this.initializePoints(copiedObject, selectorService, cursorX, cursorY);

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

  static dragPolylinePoints(cursorX: number, cursorY: number, copiedObject: ITools, selectorService: SelectorService): void {
    const newPoints = this.initializePoints(copiedObject, selectorService, cursorX, cursorY);
    const newPaths: IComplexPath[] = [];
    if (copiedObject.paths) {
      for (const path of copiedObject.paths) {
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
}
