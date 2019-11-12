import { Injectable } from '@angular/core';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';

@Injectable({
  providedIn: 'root',
})
export class SaveService {

  constructor(public drawingStorage: DrawingStorageService, public undoRedo: UndoRedoService) { }

  saveDrawing(drawing: ITools): void {
    this.drawingStorage.saveDrawing(drawing);
    if (this.undoRedo.accessingUndoList) {
      this.undoRedo.undoList.length = 0;
      this.undoRedo.accessingUndoList = false;
    }
  }
}
