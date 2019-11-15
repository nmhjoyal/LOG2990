import { Injectable } from '@angular/core';
import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UndoRedoService {

  undoList: ITools[];
  accessingUndoList: boolean;
  private isUndoing: boolean;

  constructor(public drawingStorage: DrawingStorageService) {
    this.undoList = [];
    this.accessingUndoList = false;
    this.isUndoing = false;
   }

  undo(): ITools|undefined {
    this.accessingUndoList = true;
    this.isUndoing = true;
    const poppedObject = this.drawingStorage.drawings.pop();
    if ( poppedObject ) {
      this.handlersParser(poppedObject);
      this.undoList.push(poppedObject);
    }
    return poppedObject;
  }

  redo(): ITools|undefined {
    this.isUndoing = false;
    const poppedObject = this.undoList.pop();
    if (poppedObject) {
      this.handlersParser(poppedObject);
      this.drawingStorage.saveDrawing(poppedObject);
    }
    return poppedObject;
  }

  handlersParser(operation: ITools): void {
    switch (operation.id) {
      case Id.ERASER:
        this.handleEraserOperation(operation, this.isUndoing);
        break;

      case Id.PRIMARY_COLOUR_CHANGE:
        this.handlePrimaryColourApplication(operation, this.isUndoing);
        break;

      case Id.SECONDARY_COLOUR_CHANGE:
        this.handleSecondaryColourApplication(operation, this.isUndoing);
        break;

      default:
        break;
    }
  }

  handleEraserOperation( operation: ITools, isUndo: boolean ): void {
    if ( operation.objects ) {
      if (!isUndo) {
        operation.objects.forEach((element) => {
          const index = this.drawingStorage.drawings.indexOf(element);
          this.drawingStorage.drawings.splice(index, 1);
        });
      } else if (operation.indexes) {
        for (let index = operation.objects.length - 1; index >= 0; index--) {
          const drawing = operation.objects[index];
          this.drawingStorage.drawings.splice(operation.indexes[index], 0, drawing);
        }
      }
    }
  }

  handlePrimaryColourApplication( operation: ITools, isUndo: boolean ) {
    if ( operation.indexes ) {
      const colourToApply: string|undefined = isUndo ?  operation.initialColour : operation.applicatedColour;

      'primaryColour' in this.drawingStorage.drawings[operation.indexes[0]] ?
      this.drawingStorage.drawings[operation.indexes[0]].primaryColour =  colourToApply :
      this.drawingStorage.drawings[operation.indexes[0]].colour = colourToApply;
    }
  }

  handleSecondaryColourApplication( operation: ITools, isUndo: boolean ): void {
    if ( operation.indexes ) {
    const colourToApply: string|undefined = isUndo ? operation.initialColour : operation.applicatedColour;
    this.drawingStorage.drawings[operation.indexes[0]].secondaryColour = colourToApply;
    }
  }

}
