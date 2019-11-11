import { Injectable } from '@angular/core';
import { IComplexPath } from 'src/app/drawing-view/components/tools/assets/interfaces/drawing-tool-interface';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';
import { SelectorService } from '../selector-service/selector-service';

@Injectable({
  providedIn: 'root',
})

export class ClipboardService {
  clipboard: Set<ITools>;
  pasteOffset: number;
  lastCursorX: number;
  lastCursorY: number;
  offScreen: boolean;

  constructor(protected drawingStorage: DrawingStorageService, protected selectorService: SelectorService) {
    this.clipboard = new Set<ITools>();
    this.pasteOffset = 0;
    this.lastCursorX = 0;
    this.lastCursorY = 0;
    this.offScreen = false;
  }

  copy(): void {
    if (this.selectorService.selectedObjects.size) {
      this.clipboard.clear();
      this.selectorService.selectedObjects.forEach((selectedObject) => {
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
        copiedObject.x += cursorX - this.selectorService.topCornerX - this.selectorService.MinWidth / 2 + this.pasteOffset;
        copiedObject.y += cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight / 2 + this.pasteOffset;
        if ((copiedObject.x - this.selectorService.MinWidth) > window.innerWidth
        || (copiedObject.y - this.selectorService.MinHeight) > window.innerHeight) {
          copiedObject.x -= this.pasteOffset - NumericalValues.DUPLICATE_OFFSET ;
          copiedObject.y -= this.pasteOffset - NumericalValues.DUPLICATE_OFFSET ;
          this.pasteOffset = NumericalValues.DUPLICATE_OFFSET / 2;
        }
        this.parsePolylinePoints(cursorX, cursorY, copiedObject);
        this.drawingStorage.saveDrawing({...copiedObject});
      });
      this.lastCursorX = cursorX;
      this.lastCursorY = cursorY;
      this.copy();
    }
  }

  parsePolylinePoints(cursorX: number, cursorY: number, copiedObject: ITools): void {
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
      newPoints += (parseInt(splitPoints[i], 10) + cursorX  - this.selectorService.topCornerX -  this.selectorService.MinWidth / 2
      + this.pasteOffset).toString()
      + ','
      + (parseInt(splitPoints[i + 1], 10) + cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight / 2
      + this.pasteOffset).toString()
      + ' ';
    }

    const newPaths: IComplexPath[] = [];
    if (copiedObject.paths) {
      for (const path of copiedObject.paths) {
        const pathMX = path.path.slice(1, path.path.indexOf(' '));
        const pathMY = path.path.slice(path.path.indexOf(' ') + 1, path.path.indexOf('L'));
        const pathLX = path.path.slice(path.path.indexOf('L') + 1, path.path.lastIndexOf(' '));
        const pathLY = path.path.slice(path.path.lastIndexOf(' ') + 1);
        newPaths.push( { path : 'M' + (parseInt(pathMX, 10) + cursorX  - this.selectorService.topCornerX
          - this.selectorService.MinWidth / 2 + this.pasteOffset).toString()
          + ' '
          + (parseInt(pathMY, 10) + cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight / 2
          + this.pasteOffset).toString()
          + 'L' + (parseInt(pathLX, 10) + cursorX  - this.selectorService.topCornerX
          - this.selectorService.MinWidth / 2 + this.pasteOffset).toString()
          + ' '
          + (parseInt(pathLY, 10) + cursorY - this.selectorService.topCornerY - this.selectorService.MinHeight / 2
          + this.pasteOffset).toString(),
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

  cut(): void {
    if (this.selectorService.selectedObjects.size) {
      this.copy();
      this.delete();
    }
  }

  duplicate(): void {
    this.copy();
    this.paste(this.selectorService.topCornerX + this.selectorService.MinWidth / 2  + NumericalValues.DUPLICATE_OFFSET,
      this.selectorService.topCornerY + this.selectorService.MinHeight / 2 + NumericalValues.DUPLICATE_OFFSET );
  }

  delete(): void {
    this.selectorService.selectedObjects.forEach((element) => {
      const index = this.drawingStorage.drawings.indexOf(element);
      if (index !== NumericalValues.NOT_VALID) {
        this.drawingStorage.drawings.splice(index, 1);
      }
    });
  }
}
