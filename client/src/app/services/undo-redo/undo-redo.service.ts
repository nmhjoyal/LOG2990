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
      if (poppedObject.id === Id.ERASER && poppedObject.objects) {
        for (const object of poppedObject.objects) {
          if (object.id.includes('Erased')) {
            object.id = object.id.substr(0, object.id.indexOf('Erased'));
          }
        }
      }
      this.undoList.push(poppedObject);
    }
    return poppedObject;
  }

  redo(): ITools|undefined {
    const poppedObject = this.undoList.pop();
    if ( poppedObject ) {
      /* TODO: Pour futur outils ou manipulations du dessins (efface, selector, paste),
      * gérer ici les cas spéciaux, reconnaissables par les id du ITools recu par le pop.
      * Si ça devient trop compliquer, une méthode appart pour gérer les redo peut être pertinente.*/
     if (poppedObject.id === Id.ERASER && poppedObject.objects) {
      for (const object of poppedObject.objects) {
        if (!object.id.includes('Erased')) {
          object.id += 'Erased';
        }
      }
    }
      this.drawingStorage.saveDrawing(poppedObject);
    }
    return poppedObject;
  }

}
