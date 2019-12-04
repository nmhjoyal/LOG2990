import { Injectable } from '@angular/core';
import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';
import ParserHelper from '../parser-service/parser.service';
import { SaveService } from '../save-service/save.service';
import { SelectorService } from '../selector-service/selector-service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';

@Injectable({
  providedIn: 'root',
})

export class ClipboardService {
  private clipboard: Set<ITools>;
  private pasteOffset: number;
  private lastCursorX: number;
  private lastCursorY: number;
  private deletedDrawings: ITools;

  constructor(protected drawingStorage: DrawingStorageService, protected selectorService: SelectorService,
      public undoRedoService: UndoRedoService, public saveService: SaveService) {
    this.clipboard = new Set<ITools>();
    this.pasteOffset = 0;
    this.lastCursorX = 0;
    this.lastCursorY = 0;
    this.deletedDrawings = {
      id: Id.ERASER,
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      objects: [],
      indexes: [],
    };
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
        if (copiedObject.alignX) {
          copiedObject.alignX += cursorX - this.selectorService.topCorner.x - this.selectorService.MinWidth / 2 + this.pasteOffset;
        }
        copiedObject.x += cursorX - this.selectorService.topCorner.x - this.selectorService.MinWidth / 2 + this.pasteOffset;
        copiedObject.y += cursorY - this.selectorService.topCorner.y - this.selectorService.MinHeight / 2 + this.pasteOffset;
        if ((copiedObject.x - this.selectorService.MinWidth) > window.innerWidth
        || (copiedObject.y - this.selectorService.MinHeight) > window.innerHeight) {
          if (copiedObject.alignX) {
            copiedObject.alignX -= this.pasteOffset - NumericalValues.DUPLICATE_OFFSET ;
          }
          copiedObject.x -= this.pasteOffset - NumericalValues.DUPLICATE_OFFSET ;
          copiedObject.y -= this.pasteOffset - NumericalValues.DUPLICATE_OFFSET ;
          this.pasteOffset = NumericalValues.DUPLICATE_OFFSET / 2;
        }
        ParserHelper.parsePolylinePoints(cursorX, cursorY, copiedObject, this.pasteOffset, this.selectorService);
        copiedObject.pasteOffset = this.pasteOffset;
        this.saveService.saveDrawing({...copiedObject});
      });
      this.lastCursorX = cursorX;
      this.lastCursorY = cursorY;
      this.copy();
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
    this.paste(this.selectorService.topCorner.x + this.selectorService.MinWidth / 2  + NumericalValues.DUPLICATE_OFFSET,
      this.selectorService.topCorner.y + this.selectorService.MinHeight / 2 + NumericalValues.DUPLICATE_OFFSET );
  }

  delete(): void {
    this.selectorService.selectedObjects.forEach((element) => {
      const index = this.drawingStorage.drawings.indexOf(element);
      if (index !== NumericalValues.NOT_VALID && this.deletedDrawings.objects && this.deletedDrawings.indexes) {
        this.deletedDrawings.objects.push(element);
        this.deletedDrawings.indexes.push(index);
        this.drawingStorage.drawings.splice(index, 1);
      }
    });
    this.saveService.saveDrawing({...this.deletedDrawings});
    this.deletedDrawings.objects = [];
    this.deletedDrawings.indexes = [];
  }

  undo(): void {
    const undoneOperation: ITools|undefined = this.undoRedoService.undo();
    if (undoneOperation && undoneOperation.pasteOffset) {
      this.pasteOffset -= NumericalValues.DUPLICATE_OFFSET;
    }
  }

  redo(): void {
    const redoneOperation: ITools|undefined = this.undoRedoService.redo();
    if (redoneOperation && redoneOperation.pasteOffset !== undefined) {
      this.pasteOffset = redoneOperation.pasteOffset;
    }
  }
}
