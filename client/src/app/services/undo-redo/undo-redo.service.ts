import { Injectable } from '@angular/core';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { ClipboardService } from '../clipboard/clipboard-service';
import { NumericalValues } from 'src/AppConstants/NumericalValues';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {

  undoList: ITools[];
  accessingUndoList: boolean;

  constructor(public drawingStorage: DrawingStorageService, public clipboardService: ClipboardService) {
    this.undoList = [];
    this.accessingUndoList = false;
   }

  undo(): void {
    this.accessingUndoList = true;
    const poppedObject = this.drawingStorage.drawings.pop();
    if ( poppedObject !== undefined ) {
      this.undoList.push(poppedObject);
      if (poppedObject.pasteOffset !== undefined && poppedObject.pasteOffset !== 0){
        this.clipboardService.pasteOffset -= NumericalValues.DUPLICATE_OFFSET;
      }
    }
  }

  redo(): void {
    const poppedObject = this.undoList.pop();
    if ( poppedObject !== undefined ) {
      /* TODO: Pour futur outils ou manipulations du dessins (efface, selector, paste),
      * gérer ici les cas spéciaux, reconnaissables par les id du ITools recu par le pop.
      * Si ça devient trop compliquer, une méthode appart pour gérer les redo peut être pertinente.*/
      this.drawingStorage.saveDrawing(poppedObject);
      if (poppedObject.pasteOffset !== undefined){
        this.clipboardService.pasteOffset = poppedObject.pasteOffset;
      }
    }
  }

}
