import { Injectable } from '@angular/core';
import { IComplexPath } from 'src/app/drawing-view/components/tools/assets/interfaces/drawing-tool-interface';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { SelectorService } from '../selector-service/selector-service';
import { ControlPoints } from 'src/AppConstants/ControlPoints';
import { GridService } from '../grid/grid.service';

@Injectable({
  providedIn: 'root',
})
export class ParserService {

  constructor(public gridService: GridService) {
    //
  }

  parsePolylinePoints(cursorX: number, cursorY: number, copiedObject: ITools, offset: number, selectorService: SelectorService): void {
    const newPoints = this.initializePoints(copiedObject, selectorService, cursorX, cursorY);

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

  dragPolylinePoints(cursorX: number, cursorY: number, movedObject: ITools, selectorService: SelectorService, points?: string): void {
    const newPoints = points ? points : this.initializePoints(movedObject, selectorService, cursorX, cursorY);
    const newPaths: IComplexPath[] = [];
    if (movedObject.paths) {
      for (const path of movedObject.paths) {
        const pathMX = path.path.slice(1, path.path.indexOf(' '));
        const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
        const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
        const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);
        newPaths.push({
          path: 'M' + (parseInt(pathMX, 10) + cursorX - selectorService.topCornerX
            - selectorService.MinWidth / 2).toString()
            + ' '
            + (parseInt(pathMY, 10) + cursorY - selectorService.topCornerY - selectorService.MinHeight / 2).toString()
            + 'L' + (parseInt(pathLX, 10) + cursorX - selectorService.topCornerX
              - selectorService.MinWidth / 2).toString()
            + ' '
            + (parseInt(pathLY, 10) + cursorY - selectorService.topCornerY - selectorService.MinHeight / 2).toString(),
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
      movedObject.paths = newPaths;
    }
  }

  // tslint:disable-next-line: max-line-length because it reduces readability if the fn signature is on two lines
  snapPolylinePoints(cursorX: number, cursorY: number, movedObject: ITools, selectorService: SelectorService, controlPoint: ControlPoints): void {
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

    switch (controlPoint) {
      case ControlPoints.TOP_LEFT:
        for (let i = 0; i < splitPoints.length; i += 2) {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize;
          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize;
          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;

          newPoints += (gridX + xDistToSelectorBox).toString()
            + ','
            + (gridY + yDistToSelectorBox).toString()
            + ' ';
        }
        break;
      case ControlPoints.TOP_MIDDLE:
        for (let i = 0; i < splitPoints.length; i += 2) {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize
            - ((selectorService.MinWidth / 2) % this.gridService.GridSize);
          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize;
          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;

          newPoints += (gridX + xDistToSelectorBox).toString()
            + ','
            + (gridY + yDistToSelectorBox).toString()
            + ' ';
        }
        break;
      case ControlPoints.TOP_RIGHT:
        for (let i = 0; i < splitPoints.length; i += 2) {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize
            - ((selectorService.MinWidth) % this.gridService.GridSize);
          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize;
          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;
          newPoints += (gridX + xDistToSelectorBox).toString()
            + ','
            + (gridY + yDistToSelectorBox).toString()
            + ' ';
        }
        break;
      case ControlPoints.MIDDLE_LEFT:
        for (let i = 0; i < splitPoints.length; i += 2) {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize;
          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize
            - ((selectorService.MinHeight / 2) % this.gridService.GridSize);
          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;
          newPoints += (gridX + xDistToSelectorBox).toString()
            + ','
            + (gridY + yDistToSelectorBox).toString()
            + ' ';
        }
        break;
      case ControlPoints.MIDDLE:
        for (let i = 0; i < splitPoints.length; i += 2) {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize
            - ((selectorService.MinWidth / 2) % this.gridService.GridSize);
          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize
            - ((selectorService.MinHeight / 2) % this.gridService.GridSize);
          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;
          newPoints += (gridX + xDistToSelectorBox).toString()
            + ','
            + (gridY + yDistToSelectorBox).toString()
            + ' ';
        }
        break;
      case ControlPoints.MIDDLE_RIGHT:
        for (let i = 0; i < splitPoints.length; i += 2) {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize
            - ((selectorService.MinWidth) % this.gridService.GridSize);
          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize
            - ((selectorService.MinHeight / 2) % this.gridService.GridSize);
          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;
          newPoints += (gridX + xDistToSelectorBox).toString()
            + ','
            + (gridY + yDistToSelectorBox).toString()
            + ' ';
        }
        break;
      case ControlPoints.BOTTOM_LEFT:
        for (let i = 0; i < splitPoints.length; i += 2) {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize - this.gridService.GridSize / 2;
          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize
            - ((selectorService.MinHeight) % this.gridService.GridSize);
          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;
          newPoints += (gridX + xDistToSelectorBox).toString()
            + ','
            + (gridY + yDistToSelectorBox).toString()
            + ' ';
        }
        break;
      case ControlPoints.BOTTOM_MIDDLE:
        for (let i = 0; i < splitPoints.length; i += 2) {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize
            - ((selectorService.MinWidth / 2) % this.gridService.GridSize);
          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize
            - ((selectorService.MinHeight) % this.gridService.GridSize);
          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;
          newPoints += (gridX + xDistToSelectorBox).toString()
            + ','
            + (gridY + yDistToSelectorBox).toString()
            + ' ';
        }
        break;
      case ControlPoints.BOTTOM_RIGHT:
        for (let i = 0; i < splitPoints.length; i += 2) {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize
            - ((selectorService.MinWidth) % this.gridService.GridSize);
          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize
            - ((selectorService.MinHeight) % this.gridService.GridSize);
          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;
          newPoints += (gridX + xDistToSelectorBox).toString()
            + ','
            + (gridY + yDistToSelectorBox).toString()
            + ' ';
        }
        break;
      default:
        for (let i = 0; i < splitPoints.length; i += 2) {
          const gridX = Math.round(cursorX / this.gridService.GridSize) * this.gridService.GridSize;
          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;
          const gridY = Math.round(cursorY / this.gridService.GridSize) * this.gridService.GridSize;
          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;

          newPoints += (gridX + xDistToSelectorBox).toString()
            + ','
            + (gridY + yDistToSelectorBox).toString()
            + ' ';
        }
        break;
    }
    this.dragPolylinePoints(cursorX, cursorY, movedObject, selectorService, newPoints);

  }

  initializePoints(copiedObject: ITools, selectorService: SelectorService, cursorX: number, cursorY: number): string {
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
      newPoints += (parseInt(splitPoints[i], 10) + cursorX - selectorService.topCornerX - selectorService.MinWidth / 2).toString()
        + ','
        + (parseInt(splitPoints[i + 1], 10) + cursorY - selectorService.topCornerY - selectorService.MinHeight / 2).toString()
        + ' ';
    }
    return newPoints;
  }
}
