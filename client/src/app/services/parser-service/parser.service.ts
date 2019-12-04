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

  // tslint:disable-next-line: max-line-length because readability is reduced if header is on two lines
  static dragPolylinePoints(cursorX: number, cursorY: number, movedObject: ITools, selectorService: SelectorService, points?: string, paths?: IComplexPath[]): void {
    const newPoints = points ? points : this.initializePoints(movedObject, selectorService, cursorX, cursorY);
    const newPaths: IComplexPath[] = [];
    if (movedObject.paths && !paths) {
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
    const paths: IComplexPath[] = [];

    switch (controlPoint) {
      case ControlPoints.TOP_LEFT:
        const gridX = Math.round(cursorX / gridService.GridSize) * gridService.GridSize;
        const gridY = Math.round(cursorY / gridService.GridSize) * gridService.GridSize;

        for (let i = 0; i < splitPoints.length; i += 2) {
          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;
          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;

          newPoints += (gridX + xDistToSelectorBox).toString()
            + ','
            + (gridY + yDistToSelectorBox).toString()
            + ' ';
        }

        if (movedObject.paths) {
          for (const path of movedObject.paths) {
            const pathMX = path.path.slice(1, path.path.indexOf(' '));
            const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
            const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
            const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);

            const xDistToSelectorBoxMX = parseInt(pathMX, 10) - selectorService.topCornerX;
            const xDistToSelectorBoxLX = parseInt(pathLX, 10) - selectorService.topCornerX;
            const yDistToSelectorBoxMY = parseInt(pathMY, 10) + - selectorService.topCornerY;
            const yDistToSelectorBoxLY = parseInt(pathLY, 10) + - selectorService.topCornerY;

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
        break;
      case ControlPoints.TOP_MIDDLE:
        const gridXTopMiddle = Math.round(cursorX / gridService.GridSize) * gridService.GridSize
          - ((selectorService.MinWidth / 2) % gridService.GridSize);
        const gridYTopMiddle = Math.round(cursorY / gridService.GridSize) * gridService.GridSize;

        for (let i = 0; i < splitPoints.length; i += 2) {

          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;
          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;

          newPoints += (gridXTopMiddle + xDistToSelectorBox).toString()
            + ','
            + (gridYTopMiddle + yDistToSelectorBox).toString()
            + ' ';
        }
        if (movedObject.paths) {
          for (const path of movedObject.paths) {
            const pathMX = path.path.slice(1, path.path.indexOf(' '));
            const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
            const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
            const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);

            const xDistToSelectorBoxMX = parseInt(pathMX, 10) - selectorService.topCornerX;
            const xDistToSelectorBoxLX = parseInt(pathLX, 10) - selectorService.topCornerX;
            const yDistToSelectorBoxMY = parseInt(pathMY, 10) + - selectorService.topCornerY;
            const yDistToSelectorBoxLY = parseInt(pathLY, 10) + - selectorService.topCornerY;

            paths.push({
              path: 'M'
                + (gridXTopMiddle + xDistToSelectorBoxMX).toString()
                + ' '
                + (gridYTopMiddle + yDistToSelectorBoxMY).toString()
                + 'L'
                + (gridXTopMiddle + xDistToSelectorBoxLX).toString()
                + ' '
                + (gridYTopMiddle + yDistToSelectorBoxLY).toString(),
              pathWidth: path.pathWidth,
            });
          }
        }
        break;
      case ControlPoints.TOP_RIGHT:
        const gridXTopRight = Math.round(cursorX / gridService.GridSize) * gridService.GridSize
          - ((selectorService.MinWidth) % gridService.GridSize);
        const gridYTopRight = Math.round(cursorY / gridService.GridSize) * gridService.GridSize;

        for (let i = 0; i < splitPoints.length; i += 2) {

          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;
          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;
          newPoints += (gridXTopRight + xDistToSelectorBox).toString()
            + ','
            + (gridYTopRight + yDistToSelectorBox).toString()
            + ' ';
        }
        if (movedObject.paths) {
          for (const path of movedObject.paths) {
            const pathMX = path.path.slice(1, path.path.indexOf(' '));
            const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
            const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
            const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);

            const xDistToSelectorBoxMX = parseInt(pathMX, 10) - selectorService.topCornerX;
            const xDistToSelectorBoxLX = parseInt(pathLX, 10) - selectorService.topCornerX;
            const yDistToSelectorBoxMY = parseInt(pathMY, 10) + - selectorService.topCornerY;
            const yDistToSelectorBoxLY = parseInt(pathLY, 10) + - selectorService.topCornerY;

            paths.push({
              path: 'M'
                + (gridXTopRight + xDistToSelectorBoxMX).toString()
                + ' '
                + (gridYTopRight + yDistToSelectorBoxMY).toString()
                + 'L'
                + (gridXTopRight + xDistToSelectorBoxLX).toString()
                + ' '
                + (gridYTopRight + yDistToSelectorBoxLY).toString(),
              pathWidth: path.pathWidth,
            });
          }
        }
        break;
      case ControlPoints.MIDDLE_LEFT:
        const gridXMiddleLeft = Math.round(cursorX / gridService.GridSize) * gridService.GridSize;
        const gridYMiddleLeft = Math.round(cursorY / gridService.GridSize) * gridService.GridSize
          - ((selectorService.MinHeight / 2) % gridService.GridSize);
        for (let i = 0; i < splitPoints.length; i += 2) {
          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;

          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;
          newPoints += (gridXMiddleLeft + xDistToSelectorBox).toString()
            + ','
            + (gridYMiddleLeft + yDistToSelectorBox).toString()
            + ' ';
        }
        if (movedObject.paths) {
          for (const path of movedObject.paths) {
            const pathMX = path.path.slice(1, path.path.indexOf(' '));
            const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
            const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
            const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);

            const xDistToSelectorBoxMX = parseInt(pathMX, 10) - selectorService.topCornerX;
            const xDistToSelectorBoxLX = parseInt(pathLX, 10) - selectorService.topCornerX;
            const yDistToSelectorBoxMY = parseInt(pathMY, 10) + - selectorService.topCornerY;
            const yDistToSelectorBoxLY = parseInt(pathLY, 10) + - selectorService.topCornerY;

            paths.push({
              path: 'M'
                + (gridXMiddleLeft + xDistToSelectorBoxMX).toString()
                + ' '
                + (gridYMiddleLeft + yDistToSelectorBoxMY).toString()
                + 'L'
                + (gridXMiddleLeft + xDistToSelectorBoxLX).toString()
                + ' '
                + (gridYMiddleLeft + yDistToSelectorBoxLY).toString(),
              pathWidth: path.pathWidth,
            });
          }
        }
        break;
      case ControlPoints.MIDDLE:
        const gridXMiddle = Math.round(cursorX / gridService.GridSize) * gridService.GridSize
          - ((selectorService.MinWidth / 2) % gridService.GridSize);
        const gridYMiddle = Math.round(cursorY / gridService.GridSize) * gridService.GridSize
          - ((selectorService.MinHeight / 2) % gridService.GridSize);
        for (let i = 0; i < splitPoints.length; i += 2) {

          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;

          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;
          newPoints += (gridXMiddle + xDistToSelectorBox).toString()
            + ','
            + (gridYMiddle + yDistToSelectorBox).toString()
            + ' ';
        }
        if (movedObject.paths) {
          for (const path of movedObject.paths) {
            const pathMX = path.path.slice(1, path.path.indexOf(' '));
            const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
            const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
            const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);

            const xDistToSelectorBoxMX = parseInt(pathMX, 10) - selectorService.topCornerX;
            const xDistToSelectorBoxLX = parseInt(pathLX, 10) - selectorService.topCornerX;
            const yDistToSelectorBoxMY = parseInt(pathMY, 10) + - selectorService.topCornerY;
            const yDistToSelectorBoxLY = parseInt(pathLY, 10) + - selectorService.topCornerY;

            paths.push({
              path: 'M'
                + (gridXMiddle + xDistToSelectorBoxMX).toString()
                + ' '
                + (gridYMiddle + yDistToSelectorBoxMY).toString()
                + 'L'
                + (gridXMiddle + xDistToSelectorBoxLX).toString()
                + ' '
                + (gridYMiddle + yDistToSelectorBoxLY).toString(),
              pathWidth: path.pathWidth,
            });
          }
        }

        break;
      case ControlPoints.MIDDLE_RIGHT:
        const gridXMiddleRight = Math.round(cursorX / gridService.GridSize) * gridService.GridSize
          - ((selectorService.MinWidth) % gridService.GridSize);
        const gridYMiddleRight = Math.round(cursorY / gridService.GridSize) * gridService.GridSize
          - ((selectorService.MinHeight / 2) % gridService.GridSize);

        for (let i = 0; i < splitPoints.length; i += 2) {

          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;

          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;
          newPoints += (gridXMiddleRight + xDistToSelectorBox).toString()
            + ','
            + (gridYMiddleRight + yDistToSelectorBox).toString()
            + ' ';
        }
        if (movedObject.paths) {
          for (const path of movedObject.paths) {
            const pathMX = path.path.slice(1, path.path.indexOf(' '));
            const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
            const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
            const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);

            const xDistToSelectorBoxMX = parseInt(pathMX, 10) - selectorService.topCornerX;
            const xDistToSelectorBoxLX = parseInt(pathLX, 10) - selectorService.topCornerX;
            const yDistToSelectorBoxMY = parseInt(pathMY, 10) + - selectorService.topCornerY;
            const yDistToSelectorBoxLY = parseInt(pathLY, 10) + - selectorService.topCornerY;

            paths.push({
              path: 'M'
                + (gridXMiddleRight + xDistToSelectorBoxMX).toString()
                + ' '
                + (gridYMiddleRight + yDistToSelectorBoxMY).toString()
                + 'L'
                + (gridXMiddleRight + xDistToSelectorBoxLX).toString()
                + ' '
                + (gridYMiddleRight + yDistToSelectorBoxLY).toString(),
              pathWidth: path.pathWidth,
            });
          }
        }

        break;
      case ControlPoints.BOTTOM_LEFT:
        const gridXBottomLeft = Math.round(cursorX / gridService.GridSize) * gridService.GridSize - gridService.GridSize / 2;
        const gridYBottomLeft = Math.round(cursorY / gridService.GridSize) * gridService.GridSize
          - ((selectorService.MinHeight) % gridService.GridSize);
        for (let i = 0; i < splitPoints.length; i += 2) {
          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;

          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;
          newPoints += (gridXBottomLeft + xDistToSelectorBox).toString()
            + ','
            + (gridYBottomLeft + yDistToSelectorBox).toString()
            + ' ';
        }
        if (movedObject.paths) {
          for (const path of movedObject.paths) {
            const pathMX = path.path.slice(1, path.path.indexOf(' '));
            const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
            const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
            const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);

            const xDistToSelectorBoxMX = parseInt(pathMX, 10) - selectorService.topCornerX;
            const xDistToSelectorBoxLX = parseInt(pathLX, 10) - selectorService.topCornerX;
            const yDistToSelectorBoxMY = parseInt(pathMY, 10) + - selectorService.topCornerY;
            const yDistToSelectorBoxLY = parseInt(pathLY, 10) + - selectorService.topCornerY;

            paths.push({
              path: 'M'
                + (gridXBottomLeft + xDistToSelectorBoxMX).toString()
                + ' '
                + (gridYBottomLeft + yDistToSelectorBoxMY).toString()
                + 'L'
                + (gridXBottomLeft + xDistToSelectorBoxLX).toString()
                + ' '
                + (gridYBottomLeft + yDistToSelectorBoxLY).toString(),
              pathWidth: path.pathWidth,
            });
          }
        }

        break;
      case ControlPoints.BOTTOM_MIDDLE:
        const gridXBottomMiddle = Math.round(cursorX / gridService.GridSize) * gridService.GridSize
          - ((selectorService.MinWidth / 2) % gridService.GridSize);
        const gridYBottomMiddle = Math.round(cursorY / gridService.GridSize) * gridService.GridSize
          - ((selectorService.MinHeight) % gridService.GridSize);
        for (let i = 0; i < splitPoints.length; i += 2) {

          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;

          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;
          newPoints += (gridXBottomMiddle + xDistToSelectorBox).toString()
            + ','
            + (gridYBottomMiddle + yDistToSelectorBox).toString()
            + ' ';
        }
        if (movedObject.paths) {
          for (const path of movedObject.paths) {
            const pathMX = path.path.slice(1, path.path.indexOf(' '));
            const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
            const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
            const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);

            const xDistToSelectorBoxMX = parseInt(pathMX, 10) - selectorService.topCornerX;
            const xDistToSelectorBoxLX = parseInt(pathLX, 10) - selectorService.topCornerX;
            const yDistToSelectorBoxMY = parseInt(pathMY, 10) + - selectorService.topCornerY;
            const yDistToSelectorBoxLY = parseInt(pathLY, 10) + - selectorService.topCornerY;

            paths.push({
              path: 'M'
                + (gridXBottomMiddle + xDistToSelectorBoxMX).toString()
                + ' '
                + (gridYBottomMiddle + yDistToSelectorBoxMY).toString()
                + 'L'
                + (gridXBottomMiddle + xDistToSelectorBoxLX).toString()
                + ' '
                + (gridYBottomMiddle + yDistToSelectorBoxLY).toString(),
              pathWidth: path.pathWidth,
            });
          }
        }

        break;
      case ControlPoints.BOTTOM_RIGHT:
        const gridXBottomRight = Math.round(cursorX / gridService.GridSize) * gridService.GridSize
          - ((selectorService.MinWidth) % gridService.GridSize);
        const gridYBottomRight = Math.round(cursorY / gridService.GridSize) * gridService.GridSize
          - ((selectorService.MinHeight) % gridService.GridSize);
        for (let i = 0; i < splitPoints.length; i += 2) {

          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;

          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;
          newPoints += (gridXBottomRight + xDistToSelectorBox).toString()
            + ','
            + (gridYBottomRight + yDistToSelectorBox).toString()
            + ' ';
        }
        if (movedObject.paths) {
          for (const path of movedObject.paths) {
            const pathMX = path.path.slice(1, path.path.indexOf(' '));
            const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
            const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
            const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);

            const xDistToSelectorBoxMX = parseInt(pathMX, 10) - selectorService.topCornerX;
            const xDistToSelectorBoxLX = parseInt(pathLX, 10) - selectorService.topCornerX;
            const yDistToSelectorBoxMY = parseInt(pathMY, 10) + - selectorService.topCornerY;
            const yDistToSelectorBoxLY = parseInt(pathLY, 10) + - selectorService.topCornerY;

            paths.push({
              path: 'M'
                + (gridXBottomRight + xDistToSelectorBoxMX).toString()
                + ' '
                + (gridYBottomRight + yDistToSelectorBoxMY).toString()
                + 'L'
                + (gridXBottomRight + xDistToSelectorBoxLX).toString()
                + ' '
                + (gridYBottomRight + yDistToSelectorBoxLY).toString(),
              pathWidth: path.pathWidth,
            });
          }
        }

        break;
      default:
        const gridXDefault = Math.round(cursorX / gridService.GridSize) * gridService.GridSize;
        const gridYDefault = Math.round(cursorY / gridService.GridSize) * gridService.GridSize;

        for (let i = 0; i < splitPoints.length; i += 2) {
          const xDistToSelectorBox = parseInt(splitPoints[i], 10) - selectorService.topCornerX;
          const yDistToSelectorBox = parseInt(splitPoints[i + 1], 10) + - selectorService.topCornerY;

          newPoints += (gridXDefault + xDistToSelectorBox).toString()
            + ','
            + (gridYDefault + yDistToSelectorBox).toString()
            + ' ';

        }

        if (movedObject.paths) {
          for (const path of movedObject.paths) {
            const pathMX = path.path.slice(1, path.path.indexOf(' '));
            const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
            const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
            const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);

            const xDistToSelectorBoxMX = parseInt(pathMX, 10) - selectorService.topCornerX;
            const xDistToSelectorBoxLX = parseInt(pathLX, 10) - selectorService.topCornerX;
            const yDistToSelectorBoxMY = parseInt(pathMY, 10) + - selectorService.topCornerY;
            const yDistToSelectorBoxLY = parseInt(pathLY, 10) + - selectorService.topCornerY;

            paths.push({
              path: 'M'
                + (gridXDefault + xDistToSelectorBoxMX).toString()
                + ' '
                + (gridYDefault + yDistToSelectorBoxMY).toString()
                + 'L'
                + (gridXDefault + xDistToSelectorBoxLX).toString()
                + ' '
                + (gridYDefault + yDistToSelectorBoxLY).toString(),
              pathWidth: path.pathWidth,
            });
          }
        }
        break;
    }
    this.dragPolylinePoints(cursorX, cursorY, movedObject, selectorService, newPoints, paths);

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
      newPoints += (parseInt(splitPoints[i], 10) + cursorX - selectorService.topCornerX - selectorService.MinWidth / 2).toString()
        + ','
        + (parseInt(splitPoints[i + 1], 10) + cursorY - selectorService.topCornerY - selectorService.MinHeight / 2).toString()
        + ' ';
    }
    return newPoints;
  }
}
