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
        for (let index = poppedObject.objects.length - 1; index >= 0; index--) {
          const drawing = poppedObject.objects[index];
          this.drawingStorage.drawings.splice(poppedObject.indexes[index], 0, drawing);
        }
      
      } else if (poppedObject.id === Id.PRIMARY_COLOUR_CHANGE && poppedObject.indexes) {

        'primaryColour' in this.drawingStorage.drawings[poppedObject.indexes[0]] ? 
                          this.drawingStorage.drawings[poppedObject.indexes[0]].primaryColour = poppedObject.initialColour :
                          this.drawingStorage.drawings[poppedObject.indexes[0]].colour = poppedObject.initialColour;
        
      } else if (poppedObject.id === Id.SECONDARY_COLOUR_CHANGE && poppedObject.indexes) {

        this.drawingStorage.drawings[poppedObject.indexes[0]].secondaryColour = poppedObject.initialColour;
      }
      this.undoList.push(poppedObject);
    }
    return poppedObject;
  }

  redo(): ITools|undefined {
    const poppedObject = this.undoList.pop();
    if ( poppedObject ) {
      if (poppedObject.id === Id.ERASER && poppedObject.objects && poppedObject.indexes) {

        poppedObject.objects.forEach(element => {
          const index = this.drawingStorage.drawings.indexOf(element);
          this.drawingStorage.drawings.splice(index, 1);
        });

      } else if (poppedObject.id === Id.PRIMARY_COLOUR_CHANGE && poppedObject.indexes) {

        'primaryColour' in this.drawingStorage.drawings[poppedObject.indexes[0]] ? 
                          this.drawingStorage.drawings[poppedObject.indexes[0]].primaryColour = poppedObject.applicatedColour :
                          this.drawingStorage.drawings[poppedObject.indexes[0]].colour = poppedObject.applicatedColour;
        
      } else if (poppedObject.id === Id.SECONDARY_COLOUR_CHANGE && poppedObject.indexes) {

        this.drawingStorage.drawings[poppedObject.indexes[0]].secondaryColour = poppedObject.applicatedColour;
      }
      this.drawingStorage.saveDrawing(poppedObject);
    }
    return poppedObject;
  }

}
