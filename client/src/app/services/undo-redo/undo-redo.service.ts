import { Injectable } from '@angular/core';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';

@Injectable({
  providedIn: 'root'
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
      this.undoList.push(poppedObject);
    }
    return poppedObject;
  }

  redo(): ITools|undefined {
    const poppedObject = this.undoList.pop();
    if ( poppedObject !== undefined ) {
      /* TODO: Pour futur outils ou manipulations du dessins (efface, selector, paste),
      * gérer ici les cas spéciaux, reconnaissables par les id du ITools recu par le pop.
      * Si ça devient trop compliquer, une méthode appart pour gérer les redo peut être pertinente.*/
      this.drawingStorage.saveDrawing(poppedObject);
    }
    return poppedObject;
  }

}
