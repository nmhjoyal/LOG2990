import { Injectable } from '@angular/core';
import { IComplexPath } from 'src/app/drawing-view/components/tools/assets/interfaces/drawing-tool-interface';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { SelectorService } from '../selector-service/selector-service';

@Injectable({
  providedIn: 'root',
})
export class ParserService {

  constructor() {
    //
  }

  parsePolylinePoints(cursorX: number, cursorY: number, copiedObject: ITools, offset: number, selectorService: SelectorService): void {
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
      newPoints += (parseInt(splitPoints[i], 10) + cursorX - selectorService.topCornerX - selectorService.MinWidth / 2
        + offset).toString()
        + ','
        + (parseInt(splitPoints[i + 1], 10) + cursorY - selectorService.topCornerY - selectorService.MinHeight / 2
          + offset).toString()
        + ' ';
    }

    const newPaths: IComplexPath[] = [];
    if (copiedObject.paths) {
      for (const path of copiedObject.paths) {
        const pathMX = path.path.slice(1, path.path.indexOf(' '));
        const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
        const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
        const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);
        newPaths.push({
          path: 'M' + (parseInt(pathMX, 10) + cursorX - selectorService.topCornerX
            - selectorService.MinWidth / 2 + offset).toString()
            + ' '
            + (parseInt(pathMY, 10) + cursorY - selectorService.topCornerY - selectorService.MinHeight / 2
              + offset).toString()
            + 'L' + (parseInt(pathLX, 10) + cursorX - selectorService.topCornerX
              - selectorService.MinWidth / 2 + offset).toString()
            + ' '
            + (parseInt(pathLY, 10) + cursorY - selectorService.topCornerY - selectorService.MinHeight / 2
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

  dragPolylinePoints(cursorX: number, cursorY: number, copiedObject: ITools, selectorService: SelectorService): void {
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
      newPoints += (cursorX - parseInt(splitPoints[i], 10)).toString()
        + ','
        + (cursorY - parseInt(splitPoints[i + 1], 10) + cursorY).toString()
        + ' ';
    }

    const newPaths: IComplexPath[] = [];
    if (copiedObject.paths) {
      for (const path of copiedObject.paths) {
        const pathMX = path.path.slice(1, path.path.indexOf(' '));
        const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
        const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
        const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);
        newPaths.push({
          path: 'M' + (parseInt(pathMX, 10)).toString()
            + ' '
            + (parseInt(pathMY, 10)).toString()
            + 'L'
            + (parseInt(pathLX, 10)).toString()
            + ' '
            + (parseInt(pathLY, 10)).toString(),
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

}
