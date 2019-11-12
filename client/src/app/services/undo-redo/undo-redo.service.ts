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

  constructor(public drawingStorage: DrawingStorageService) {
    this.undoList = [];
    this.accessingUndoList = false;
   }

  undo(): ITools|undefined {
    this.accessingUndoList = true;
    const poppedObject = this.drawingStorage.drawings.pop();
    if ( poppedObject !== undefined ) {
      if (poppedObject.id === Id.ERASER && poppedObject.objects && poppedObject.indexes) {
        for (let index = 0; index < poppedObject.objects.length; index++) {
          const drawing = poppedObject.objects[index];
          this.drawingStorage.drawings.splice(poppedObject.indexes[index], 0, drawing);
        }
      }
      this.undoList.push(poppedObject);
    }
    return poppedObject;
  }

  redo(): ITools|undefined {
    const poppedObject = this.undoList.pop();
    if ( poppedObject ) {
      if (poppedObject.id === Id.ERASER && poppedObject.objects && poppedObject.indexes) {
        for (let index = 0; index < poppedObject.objects.length; index++) {
          this.drawingStorage.drawings.splice(poppedObject.indexes[index], 1);
        }
      }
      this.drawingStorage.saveDrawing(poppedObject);
    }
    return poppedObject;
  }

}
